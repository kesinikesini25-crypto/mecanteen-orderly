import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'dish' | 'combo';
  preparation_time: number;
}

export default function Menu() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMenuItems();
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadCartFromStorage = () => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  };

  const fetchMenuItems = async () => {
    try {
      const [dishesRes, combosRes] = await Promise.all([
        supabase.from('dishes').select('*').eq('is_available', true).order('serial_no'),
        supabase.from('combos').select('*').eq('is_available', true),
      ]);

      if (dishesRes.error) throw dishesRes.error;
      if (combosRes.error) throw combosRes.error;

      setDishes(dishesRes.data || []);
      setCombos(combosRes.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: any, type: 'dish' | 'combo') => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    const existingItem = cart.find((i) => i.id === item.id && i.type === type);
    
    if (existingItem) {
      setCart(cart.map((i) =>
        i.id === item.id && i.type === type
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: 1,
          type,
          preparation_time: item.preparation_time,
        },
      ]);
    }

    toast({
      title: 'Added to Cart',
      description: `${item.name} added successfully`,
    });
  };

  const DishCard = ({ dish }: { dish: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden bg-muted">
        {dish.image_url && (
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        )}
        {dish.is_special && (
          <Badge className="absolute top-2 right-2 bg-secondary">
            <Star className="h-3 w-3 mr-1" />
            Special
          </Badge>
        )}
        <Badge className="absolute top-2 left-2 bg-background/90">
          #{dish.serial_no}
        </Badge>
      </div>
      <CardHeader className="space-y-2">
        <h3 className="font-semibold text-lg">{dish.name}</h3>
        {dish.description && (
          <p className="text-sm text-muted-foreground">{dish.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{dish.price}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {dish.preparation_time} min
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => addToCart(dish, 'dish')}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  const ComboCard = ({ combo }: { combo: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-accent/50">
      <div className="relative h-48 overflow-hidden bg-muted">
        {combo.image_url && (
          <img
            src={combo.image_url}
            alt={combo.name}
            className="w-full h-full object-cover"
          />
        )}
        {combo.discount_percentage && (
          <Badge className="absolute top-2 right-2 bg-accent">
            {combo.discount_percentage}% OFF
          </Badge>
        )}
      </div>
      <CardHeader className="space-y-2">
        <h3 className="font-semibold text-lg">{combo.name}</h3>
        {combo.description && (
          <p className="text-sm text-muted-foreground">{combo.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">₹{combo.price}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {combo.preparation_time} min
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={() => addToCart(combo, 'combo')}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-muted-foreground">Fresh food made with love</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="dishes">Dishes</TabsTrigger>
            <TabsTrigger value="combos">Combo Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {combos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Combo Meals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {combos.map((combo) => (
                    <ComboCard key={combo.id} combo={combo} />
                  ))}
                </div>
              </div>
            )}
            
            {dishes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Individual Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dishes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
