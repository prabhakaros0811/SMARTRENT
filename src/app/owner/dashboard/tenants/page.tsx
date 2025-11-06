'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTenants, mockProperties } from '@/lib/data';
import type { Tenant, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';


export default function OwnerTenantsPage() {
    const { toast } = useToast();
    const [tenants, setTenants] = useState<(Tenant & User)[]>(mockTenants);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
  
    const handleAddTenant = () => {
      if (!name || !email || !propertyId || !userId || !password) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in all fields to add a tenant.",
        });
        return;
      }

      if (mockTenants.some(t => t.id === userId)) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "A tenant with this User ID already exists.",
        });
        return;
      }
      
      const newTenant: Tenant & User = {
        id: userId,
        name,
        email,
        propertyId,
        ownerId: 'owner-1', // Assuming single owner
        role: 'tenant',
        avatar: `https://i.pravatar.cc/150?u=${userId}`,
        password: password,
      };
      
      mockTenants.push(newTenant);
      setTenants([...mockTenants]);

      // Reset form and close add dialog
      setName('');
      setEmail('');
      setPropertyId('');
      setUserId('');
      setPassword('');
      setIsAddDialogOpen(false);

      toast({
        title: 'Tenant Added Successfully!',
        description: `${name} has been added.`,
      });
    };

    const handleRemoveTenant = (tenantId: string) => {
        const tenantIndex = mockTenants.findIndex(t => t.id === tenantId);
        if (tenantIndex > -1) {
            const tenantName = mockTenants[tenantIndex].name;
            // Instead of just removing, we could mark as inactive in a real DB.
            // For mock data, we splice.
            mockTenants.splice(tenantIndex, 1);
            setTenants([...mockTenants]);
            toast({
                title: 'Tenant Removed',
                description: `${tenantName} has been removed and their access is revoked.`,
            });
        }
    };
  

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Your Tenants</CardTitle>
            <CardDescription>
            A list of all your current tenants.
            </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new tenant and assign them credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="property" className="text-right">
                  Property
                </Label>
                <Select onValueChange={setPropertyId} value={propertyId}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockProperties.filter(p => !p.tenantId).map(property => (
                            <SelectItem key={property.id} value={property.id}>{property.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userId" className="text-right">
                  User ID
                </Label>
                <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTenant}>Add Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map(tenant => {
              const property = mockProperties.find(
                p => p.id === tenant.propertyId
              );
              return (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={tenant.avatar} alt="Avatar" />
                        <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{tenant.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {property ? property.title : 'N/A'}
                  </TableCell>
                  <TableCell><code>{tenant.id}</code></TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveTenant(tenant.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Tenant</span>
                      </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
