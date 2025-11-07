'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockOwners } from '@/lib/data';
import type { User } from '@/lib/types';
import { LoaderCircle, Save } from 'lucide-react';

export default function OwnerProfilePage() {
  const { toast } = useToast();
  const [owner, setOwner] = React.useState<User | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    const loggedInOwnerId = localStorage.getItem('loggedInOwnerId');
    const currentOwner = mockOwners.find(o => o.id === loggedInOwnerId);
    if (currentOwner) {
      setOwner(currentOwner);
      setName(currentOwner.name);
      setEmail(currentOwner.email);
    }
  }, []);

  const handleSaveChanges = () => {
    if (!owner) return;
    setIsSaving(true);

    setTimeout(() => {
      const ownerIndex = mockOwners.findIndex(o => o.id === owner.id);
      if (ownerIndex !== -1) {
        mockOwners[ownerIndex] = { ...mockOwners[ownerIndex], name, email };
        
        // Also update the local state to reflect changes immediately
        setOwner(mockOwners[ownerIndex]);

        toast({
          title: 'Profile Updated',
          description: 'Your profile information has been saved.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not save changes. Owner not found.',
        });
      }
      setIsSaving(false);
    }, 1000);
  };

  if (!owner) {
    return <div className="flex justify-center items-center h-full"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and edit your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={owner.avatar} alt={owner.name} />
              <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
                <h2 className="text-2xl font-bold">{owner.name}</h2>
                <p className="text-muted-foreground">{owner.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <LoaderCircle className="mr-2 animate-spin" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
