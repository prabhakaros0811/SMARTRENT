
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Users, IndianRupee, MessageCircleWarning, BellRing, Bot, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: <Building2 className="w-8 h-8 text-primary" />,
    title: 'Property Management',
    description: 'Easily add, edit, and manage all your properties from a centralized dashboard.',
  },
  {
    icon: <Users className="w-8 h-8 text-accent" />,
    title: 'Tenant Management',
    description: 'Onboard new tenants, track assignments, and manage tenant information seamlessly.',
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-green-500" />,
    title: 'Rent Tracking',
    description: 'Request rent payments, confirm receipts, and send reminders for overdue payments.',
  },
   {
    icon: <Bot className="w-8 h-8 text-purple-500" />,
    title: 'AI Rent Predictor',
    description: 'Leverage AI to get competitive rental rate predictions for your properties.',
  },
  {
    icon: <MessageCircleWarning className="w-8 h-8 text-red-500" />,
    title: 'Complaint System',
    description: 'Tenants can submit complaints, and owners can track and resolve them efficiently.',
  },
  {
    icon: <BellRing className="w-8 h-8 text-indigo-500" />,
    title: 'Announcements',
    description: 'Broadcast important messages and updates to all your tenants at once.',
  },
];


export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex-1 w-full">
        <section className="relative flex flex-col items-center justify-center text-center py-20 lg:py-32">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover opacity-10"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center p-4 animate-fade-in-up">
            <Icons.logo className="h-16 w-16 mb-4 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
              Welcome to RentEase
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
              The all-in-one solution for managing your properties. Choose your role to get started.
            </p>
          </div>

          <div className="relative z-10 mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl w-full p-4 animate-fade-in-up animation-delay-300">
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                  <Icons.owner className="h-6 w-6" />
                  Property Owner
                </CardTitle>
                <CardDescription>
                  Manage your properties, tenants, and finances with ease.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/owner/login" className="w-full">
                  <Button className="w-full">
                    Owner Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                  <Icons.tenant className="h-6 w-6" />
                  Tenant
                </CardTitle>
                <CardDescription>
                  Access your rental details, history, and support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tenant/login" className="w-full">
                  <Button className="w-full" variant="accent">
                    Tenant Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section ref={ref} className="py-20 lg:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Features at a Glance
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to streamline your rental management experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full text-center group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <CardHeader className="items-center">
                      <div className="p-4 bg-primary/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-16 text-center text-sm text-muted-foreground p-4">
        <p>&copy; {new Date().getFullYear()} RentEase. All rights reserved.</p>
      </footer>
    </div>
  );
}
