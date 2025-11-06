'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { mockTenants } from '@/lib/data';
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
import Link from 'next/link';

interface LoginFormProps {
  userType: 'owner' | 'tenant';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(
    userType === 'owner' ? 'owner@emall.com' : ''
  );
  const [password, setPassword] = useState(userType === 'owner' ? 'password' : '');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      let isAuthenticated = false;
      if (userType === 'owner') {
        isAuthenticated =
          username === 'owner@emall.com' && password === 'password';
      } else {
        const tenant = mockTenants.find(t => t.id === username);
        isAuthenticated = !!tenant && tenant.password === password;
        if (tenant && isAuthenticated) {
          // In a real app, you would manage session state.
          // For this mock, we'll store it in localStorage.
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
    userType === 'owner' ? 'user@example.com' : 'e.g., tenant-12345';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Icon className="h-10 w-10 text-primary" />
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
