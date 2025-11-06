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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTenants, mockProperties } from '@/lib/data';
import type { Tenant, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Copy } from 'lucide-react';

// A simple password generator
const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};


export default function OwnerTenantsPage() {
    const { toast } = useToast();
    const [tenants, setTenants] = useState<(Tenant & User)[]>(mockTenants);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // State for the new tenant info dialog
    const [newTenantInfo, setNewTenantInfo] = useState<{id: string, password: string} | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [propertyId, setPropertyId] = useState('');
  
    const handleAddTenant = () => {
      if (!name || !email || !propertyId) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in all fields to add a tenant.",
        });
        return;
      }
      
      const newTenantId = `tenant-${Date.now()}`;
      const newPassword = generatePassword();
      const newTenant: Tenant & User = {
        id: newTenantId,
        name,
        email,
        propertyId,
        ownerId: 'owner-1', // Assuming single owner
        role: 'tenant',
        avatar: `https://i.pravatar.cc/150?u=${newTenantId}`,
        password: newPassword,
      };
      
      mockTenants.push(newTenant);
      setTenants([...mockTenants]);

      // Reset form and close add dialog
      setName('');
      setEmail('');
      setPropertyId('');
      setIsAddDialogOpen(false);
      
      // Show new tenant credentials
      setNewTenantInfo({ id: newTenantId, password: newPassword });

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: 'Credentials copied to clipboard.'
        });
    }
  

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
                Fill in the details to add a new tenant. A unique User ID and password will be generated for them.
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
            </div>
            <DialogFooter>
              <Button onClick={handleAddTenant}>Generate Credentials</Button>
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

    <Dialog open={!!newTenantInfo} onOpenChange={() => setNewTenantInfo(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tenant Credentials</DialogTitle>
                <DialogDescription>
                    Please copy and share these credentials with the new tenant.
                </DialogDescription>
            </DialogHeader>
            {newTenantInfo && (
                <Alert>
                    <AlertTitle>Login Details</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-2 mt-2">
                           <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <code className="font-mono">{newTenantInfo.id}</code>
                                </div>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newTenantInfo.id)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                           </div>
                           <div className="flex items-center justify-between">
                               <div>
                                    <p className="text-sm text-muted-foreground">Password</p>
                                    <code className="font-mono">{newTenantInfo.password}</code>
                               </div>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newTenantInfo.password)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                           </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
             <DialogFooter>
                <Button onClick={() => setNewTenantInfo(null)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
