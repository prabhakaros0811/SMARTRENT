'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockOwners } from '@/lib/data';

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
import type { User } from '@/lib/types';

interface SignupFormProps {
  userType: 'owner' | 'tenant';
}

export function SignupForm({ userType }: SignupFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
     if (!name.trim() || !email.trim() || !password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Please fill in all fields.',
      });
      return;
    }
    
    setIsLoading(true);

    setTimeout(() => {
      if (userType === 'owner') {
        const existingOwner = mockOwners.find(o => o.email === email);
        if (existingOwner) {
          toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'An owner with this email already exists.',
          });
          setIsLoading(false);
          return;
        }

        const newOwner: User = {
          id: `owner-${Date.now()}`,
          name,
          email,
          role: 'owner',
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          password,
        };

        mockOwners.push(newOwner);

        toast({
          title: 'Signup Successful',
          description: 'You can now log in with your credentials.',
        });
        router.push('/owner/login');
      }
      // Tenant signup logic can be added here if needed in the future
      setIsLoading(false);
    }, 1000);
  };

  const title = 'Owner Sign Up';
  const description = 'Create your account to start managing properties.';
  const Icon = Icons.owner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl animate-fade-in-up">
        <form onSubmit={handleSignup}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Icon className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
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
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
             <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/owner/login" className="underline hover:text-primary">
                    Log In
                </Link>
             </p>
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
