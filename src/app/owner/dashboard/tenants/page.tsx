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
import { mockTenants, mockProperties, mockRentPayments, mockDocuments } from '@/lib/data';
import type { Tenant, User, Property, Document } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, FileText, FileArchive, File as FileIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';


export default function OwnerTenantsPage() {
    const { toast } = useToast();
    const [tenants, setTenants] = useState<(Tenant & User)[]>(mockTenants);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
    const [isDocsDialogOpen, setIsDocsDialogOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<(Tenant & User & { property?: Property }) | null>(null);

    // Form state for adding tenant
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // Form state for requesting rent
    const [rentMonth, setRentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [rentYear, setRentYear] = useState(new Date().getFullYear());
  
    const resetAddTenantForm = () => {
        setName('');
        setEmail('');
        setPropertyId('');
        setUserId('');
        setPassword('');
    }

    const handleAddTenant = () => {
      if (!name.trim() || !email.trim() || !propertyId || !userId.trim() || !password.trim()) {
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

      // Find the selected property and update its tenantId
      const propertyIndex = mockProperties.findIndex(p => p.id === propertyId);
      if (propertyIndex !== -1) {
          mockProperties[propertyIndex].tenantId = userId;
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

      resetAddTenantForm();
      setIsAddDialogOpen(false);

      toast({
        title: 'Tenant Added Successfully!',
        description: `${name} has been added with User ID: ${userId}`,
      });
    };

    const handleRemoveTenant = (tenantId: string) => {
        const tenantIndex = mockTenants.findIndex(t => t.id === tenantId);
        if (tenantIndex > -1) {
            const tenant = mockTenants[tenantIndex];
            const tenantName = tenant.name;

            // Unassign tenant from property
            const propertyIndex = mockProperties.findIndex(p => p.id === tenant.propertyId);
            if (propertyIndex !== -1) {
                mockProperties[propertyIndex].tenantId = undefined;
            }
            
            // For mock data, we splice.
            mockTenants.splice(tenantIndex, 1);
            setTenants([...mockTenants]);
            
            toast({
                title: 'Tenant Removed',
                description: `${tenantName} has been removed and their access is revoked.`,
            });
        }
    };

    const handleOpenRentDialog = (tenant: Tenant & User) => {
        const property = mockProperties.find(p => p.id === tenant.propertyId);
        setSelectedTenant({...tenant, property });
        setIsRentDialogOpen(true);
    };

    const handleOpenDocsDialog = (tenant: Tenant & User) => {
        setSelectedTenant(tenant);
        setIsDocsDialogOpen(true);
    };

    const getTenantDocuments = () => {
        if (!selectedTenant) return [];
        return mockDocuments.filter(doc => doc.tenantId === selectedTenant.id);
    };


    const handleSendRentRequest = () => {
        if (!selectedTenant || !selectedTenant.property) {
             toast({ variant: "destructive", title: "Error", description: "Invalid tenant or property." });
            return;
        }

        const existingRequest = mockRentPayments.find(p => p.tenantId === selectedTenant.id && p.month === rentMonth && p.year === rentYear);

        if (existingRequest) {
            toast({ variant: "destructive", title: "Duplicate Request", description: `A rent request for ${rentMonth} ${rentYear} already exists.` });
            return;
        }

        const dueDate = new Date(rentYear, new Date(Date.parse(rentMonth +" 1, 2024")).getMonth(), 5);

        const newRentPayment = {
            id: `rent-${Date.now()}`,
            propertyId: selectedTenant.property.id,
            tenantId: selectedTenant.id,
            month: rentMonth,
            year: rentYear,
            amount: selectedTenant.property.rent,
            status: 'Pending' as 'Pending',
            dueDate: dueDate.toISOString(),
        };

        mockRentPayments.unshift(newRentPayment);

        toast({
            title: 'Rent Request Sent',
            description: `Request for ${formatCurrency(newRentPayment.amount)} sent to ${selectedTenant.name} for ${rentMonth} ${rentYear}.`,
        });

        setIsRentDialogOpen(false);
        setSelectedTenant(null);
    }
  

  return (
    <>
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Your Tenants</CardTitle>
            <CardDescription>
            A list of all your current tenants.
            </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={() => {
                resetAddTenantForm();
                setIsAddDialogOpen(true);
            }}>
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
              <Button onClick={handleAddTenant} disabled={!name.trim() || !email.trim() || !propertyId || !userId.trim() || !password.trim()}>Add Tenant</Button>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant, index) => {
              const property = mockProperties.find(
                p => p.id === tenant.propertyId
              );
              return (
                <TableRow key={tenant.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                  <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleOpenDocsDialog(tenant)}>
                          <FileArchive className="h-4 w-4 mr-2" />
                          View Docs
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenRentDialog(tenant)} disabled={!property}>
                          <FileText className="h-4 w-4 mr-2" />
                          Request Rent
                      </Button>
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

    {/* Rent Request Dialog */}
    <Dialog open={isRentDialogOpen} onOpenChange={setIsRentDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Rent Request to {selectedTenant?.name}</DialogTitle>
                <DialogDescription>
                    This will create a new pending payment for the tenant for the selected month.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Property</Label>
                    <Input value={selectedTenant?.property?.title || ''} readOnly className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Rent Amount</Label>
                    <Input value={formatCurrency(selectedTenant?.property?.rent || 0)} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="month" className="text-right">Month</Label>
                    <Select value={rentMonth} onValueChange={setRentMonth}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">Year</Label>
                    <Input id="year" type="number" value={rentYear} onChange={(e) => setRentYear(Number(e.target.value))} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                 <Button variant="outline" onClick={() => setIsRentDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSendRentRequest}>Send Request</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* View Documents Dialog */}
    <Dialog open={isDocsDialogOpen} onOpenChange={setIsDocsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Documents for {selectedTenant?.name}</DialogTitle>
                <DialogDescription>
                    Review the documents uploaded by the tenant.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getTenantDocuments().length > 0 ? getTenantDocuments().map((doc, index) => (
                            <TableRow key={doc.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <TableCell className="flex items-center gap-2">
                                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                                    {doc.name}
                                </TableCell>
                                <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')}>View</Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No documents uploaded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDocsDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}

    
    