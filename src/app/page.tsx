import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover opacity-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <Icons.logo className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
          Welcome to eMall Portal
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
          The all-in-one solution for managing your properties. Choose your role to get started.
        </p>
      </div>

      <div className="relative z-10 mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl w-full">
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
              <Button className="w-full" variant="outline">
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
               <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Tenant Login <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
       <footer className="relative z-10 mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} eMall Portal. All rights reserved.</p>
      </footer>
    </main>
  );
}
