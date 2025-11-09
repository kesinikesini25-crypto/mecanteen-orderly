import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Clock, Shield, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-canteen.jpg';
import southIndianCombo from '@/assets/south-indian-combo.jpg';
import lunchCombo from '@/assets/lunch-combo.jpg';
import snackCombo from '@/assets/snack-combo.jpg';

export default function Index() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Fresh & Delicious',
      description: 'Quality food prepared daily with care',
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Order ahead and skip the queue',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Safe QR code payment system',
    },
    {
      icon: Sparkles,
      title: 'Daily Specials',
      description: 'New combo offers every day',
    },
  ];

  const featuredCombos = [
    {
      name: 'South Indian Breakfast',
      image: southIndianCombo,
      price: '₹60',
    },
    {
      name: 'Lunch Thali',
      image: lunchCombo,
      price: '₹80',
    },
    {
      name: 'Snack Time',
      image: snackCombo,
      price: '₹50',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-white text-foreground shadow-sm">
              <img
                src="https://www.madrascollege.ac.in/v1.0.1/bucket/mec-big-logo.png"
                alt="Madras Engineering College"
                className="h-8 w-auto object-contain"
              />
              <span className="sr-only">Madras Engineering College</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Order Your Favorite{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Canteen Food
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Skip the queue, order ahead, and enjoy fresh meals from your college canteen
            </p>
            <div className="flex gap-4">
              <Link to="/menu">
                <Button size="lg" className="text-lg">
                  View Menu
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MEC Canteen?</h2>
            <p className="text-muted-foreground">Everything you need for a great meal experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Combos */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Today's Specials</h2>
            <p className="text-muted-foreground">Check out our popular combo meals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCombos.map((combo) => (
              <Card key={combo.name} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-foreground mb-1">{combo.name}</h3>
                    <p className="text-2xl font-bold text-accent">{combo.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/menu">
              <Button size="lg" variant="outline">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">
            Create your account and start enjoying hassle-free food ordering
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
