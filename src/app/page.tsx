
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Users, IndianRupee, MessageCircleWarning, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: <Building2 className="w-8 h-8 text-primary" />,
    title: 'Effortless Property Management',
    description: 'Easily add, edit, and manage all your properties from a centralized, elegant dashboard.',
    imageId: 'feature-1',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Seamless Tenant Onboarding',
    description: 'Onboard new tenants, track assignments, and manage tenant information without hassle.',
    imageId: 'feature-2',
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-primary" />,
    title: 'Automated Rent Tracking',
    description: 'Request rent payments, confirm receipts, and send automated reminders for overdue payments.',
    imageId: 'feature-3',
  },
  {
    icon: <MessageCircleWarning className="w-8 h-8 text-primary" />,
    title: 'Integrated Complaint System',
    description: 'Tenants can submit complaints with ease, and owners can track and resolve them efficiently.',
    imageId: 'feature-5',
  },
  {
    icon: <BellRing className="w-8 h-8 text-primary" />,
    title: 'Instant Announcements',
    description: 'Broadcast important messages and updates to all your tenants at once with a single click.',
    imageId: 'feature-6',
  },
];


export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 w-full">
        <section className="relative flex flex-col items-center justify-center text-center py-24 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <div className="p-3 bg-primary/20 border border-primary/30 rounded-full mb-4 animate-fade-in-up">
              <Icons.logo className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-headline animate-fade-in-up animation-delay-200">
              The Future of Rental Management is Here
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl animate-fade-in-up animation-delay-400">
              RentEase provides an elegant, all-in-one solution for property owners and tenants. Streamline your operations and enhance your rental experience.
            </p>
          </div>

          <div className="relative z-10 mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl w-full p-4">
            <Card className="bg-card/70 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up animation-delay-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                  <Icons.owner className="h-7 w-7" />
                  For Property Owners
                </CardTitle>
                <CardDescription>
                  Manage your properties, tenants, and finances with unparalleled ease and sophistication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/owner/login" className="w-full">
                  <Button className="w-full text-lg py-6">
                    Owner Portal <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-fade-in-up animation-delay-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                  <Icons.tenant className="h-7 w-7" />
                  For Tenants
                </CardTitle>
                <CardDescription>
                  Access your rental details, make payments, and communicate with your owner seamlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tenant/login" className="w-full">
                  <Button className="w-full text-lg py-6" variant="accent">
                    Tenant Portal <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section ref={ref} className="py-20 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                Designed for Excellence
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                RentEase blends powerful functionality with an elegant interface, turning property management into an engaging and effortless experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const featureImage = PlaceHolderImages.find(p => p.id === feature.imageId);
                return (
                    <div
                    key={feature.title}
                    className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                    >
                    <Card className="relative h-full text-left group transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/30 bg-card border-border/50 overflow-hidden">
                        {featureImage && (
                            <Image
                                src={featureImage.imageUrl}
                                alt={feature.title}
                                data-ai-hint={featureImage.imageHint}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                        <div className="relative h-full flex flex-col justify-end p-6">
                            <div className="p-3 bg-secondary/80 backdrop-blur-sm rounded-lg self-start mb-4">
                                {feature.icon}
                            </div>
                            <CardTitle className='text-lg text-white'>{feature.title}</CardTitle>
                            <p className="text-white/80 text-sm mt-2">{feature.description}</p>
                        </div>
                    </Card>
                    </div>
                )
              })}
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
