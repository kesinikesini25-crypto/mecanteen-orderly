import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Clock, Package, Truck, AlertCircle } from 'lucide-react';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrder();
    
    // Subscribe to order updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user, navigate]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setOrder(orderData);
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-muted-foreground', label: 'Order Received' };
      case 'confirmed':
        return { icon: CheckCircle2, color: 'text-blue-500', label: 'Confirmed' };
      case 'preparing':
        return { icon: Package, color: 'text-accent', label: 'Being Prepared' };
      case 'ready':
        return { icon: Truck, color: 'text-success', label: 'Ready for Pickup' };
      case 'completed':
        return { icon: CheckCircle2, color: 'text-success', label: 'Completed' };
      case 'cancelled':
        return { icon: AlertCircle, color: 'text-destructive', label: 'Cancelled' };
      default:
        return { icon: Clock, color: 'text-muted-foreground', label: 'Processing' };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline">Payment Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
              <Button onClick={() => navigate('/orders')}>View My Orders</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            ← Back to Orders
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.order_number}</CardTitle>
                {getPaymentStatusBadge(order.payment_status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Progress */}
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full bg-muted ${statusInfo.color}`}>
                    <StatusIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold">{statusInfo.label}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order Time</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Ready Time</p>
                  <p className="font-semibold">
                    {order.estimated_ready_time
                      ? new Date(order.estimated_ready_time).toLocaleTimeString()
                      : 'Calculating...'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preparation Time</p>
                  <p className="font-semibold">{order.preparation_time} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-primary text-lg">₹{order.total_amount}</p>
                </div>
              </div>

              {order.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code for Payment */}
          {order.payment_status === 'pending' && order.payment_qr_code && (
            <Card>
              <CardHeader>
                <CardTitle>Scan to Pay</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <img
                  src={order.payment_qr_code}
                  alt="Payment QR Code"
                  className="w-64 h-64"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Scan this QR code to complete payment
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.item_name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
