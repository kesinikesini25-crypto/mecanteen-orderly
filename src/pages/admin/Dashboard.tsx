import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UtensilsCrossed, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  const adminSections = [
    {
      title: 'Manage Dishes',
      description: 'Add, edit, or remove dishes from the menu',
      icon: UtensilsCrossed,
      link: '/admin/dishes',
      color: 'text-primary',
    },
    {
      title: 'Manage Combos',
      description: 'Create and manage combo meal offerings',
      icon: Package,
      link: '/admin/combos',
      color: 'text-accent',
    },
    {
      title: 'View Orders',
      description: 'Track and manage all student orders',
      icon: ShoppingCart,
      link: '/admin/orders',
      color: 'text-success',
    },
    {
      title: 'Analytics',
      description: 'View sales reports and popular items',
      icon: TrendingUp,
      link: '/admin/analytics',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your canteen operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => (
            <Link key={section.link} to={section.link}>
              <Card className="hover:shadow-lg transition-all h-full">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-full bg-muted mb-4 ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <p className="text-3xl font-bold">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-3xl font-bold text-primary">₹-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-3xl font-bold text-accent">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
