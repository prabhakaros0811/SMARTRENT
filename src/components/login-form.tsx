'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { mockTenants, mockOwners } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from './icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface LoginFormProps {
  userType: 'owner' | 'tenant';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const bgImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter both username and password.',
      });
      return;
    }
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      let isAuthenticated = false;
      if (userType === 'owner') {
        const owner = mockOwners.find(o => o.email === username && o.password === password);
        isAuthenticated = !!owner;
        if(owner) {
           localStorage.setItem('loggedInOwnerId', owner.id);
        }
      } else {
        const tenant = mockTenants.find(t => t.id === username);
        isAuthenticated = !!tenant && tenant.password === password;
        if (tenant && isAuthenticated) {
          localStorage.setItem('loggedInTenantId', tenant.id);
        }
      }

      if (isAuthenticated) {
        router.push(`/${userType}/dashboard`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid username or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const title = userType === 'owner' ? 'Owner Login' : 'Tenant Login';
  const description =
    userType === 'owner'
      ? 'Access your dashboard to manage properties.'
      : 'Login to view your rental information.';
  const Icon = userType === 'owner' ? Icons.owner : Icons.tenant;
  const buttonVariant = userType === 'owner' ? 'default' : 'accent';
  const usernameLabel = userType === 'owner' ? 'Email' : 'User ID';
  const usernamePlaceholder =
    userType === 'owner' ? 'user@example.com' : 'e.g., tenant-1';

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
       {bgImage && (
        <Image
            src={bgImage.imageUrl}
            alt={bgImage.description}
            data-ai-hint={bgImage.imageHint}
            fill
            className="object-cover -z-10"
        />
      )}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      <Card className="w-full max-w-sm shadow-2xl animate-fade-in-up bg-card/80">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Icon className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">{usernameLabel}</Label>
              <Input
                id="username"
                type="text"
                placeholder={usernamePlaceholder}
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              variant={buttonVariant}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : 'Login'}
            </Button>

            {userType === 'owner' && (
               <p className="text-sm text-center text-muted-foreground">
                 Don&apos;t have an account?{' '}
                 <Link href="/owner/signup" className="underline hover:text-primary">
                    Sign Up
                 </Link>
               </p>
            )}

            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowRight className="inline-block mr-1 h-3 w-3 rotate-180" />
              Back to role selection
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
