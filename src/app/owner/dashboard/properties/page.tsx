'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProperties, getTenantForProperty } from '@/lib/data';
import type { Property } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { User, PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OwnerPropertiesPage() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [type, setType] = useState<'Apartment' | 'House' | 'Villa'>('Apartment');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFootage, setSquareFootage] = useState('');

  const resetForm = () => {
    setTitle('');
    setAddress('');
    setRent('');
    setType('Apartment');
    setBedrooms('');
    setBathrooms('');
    setSquareFootage('');
    setSelectedProperty(null);
  };

  const handleOpenForm = (property: Property | null) => {
    if (property) {
      setSelectedProperty(property);
      setTitle(property.title);
      setAddress(property.address);
      setRent(String(property.rent));
      setType(property.type);
      setBedrooms(String(property.bedrooms));
      setBathrooms(String(property.bathrooms));
      setSquareFootage(String(property.squareFootage));
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !address.trim() || !rent.trim() || !bedrooms.trim() || !bathrooms.trim() || !squareFootage.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const newPropertyData = {
      title,
      address,
      rent: parseFloat(rent),
      type,
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseInt(bathrooms, 10),
      squareFootage: parseInt(squareFootage, 10),
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`, // random image
      ownerId: 'owner-1',
    };

    if (selectedProperty) {
      // Editing existing property
      const updatedProperty = { ...selectedProperty, ...newPropertyData };
      const propertyIndex = mockProperties.findIndex(p => p.id === selectedProperty.id);
      if (propertyIndex !== -1) {
        mockProperties[propertyIndex] = updatedProperty;
        setProperties([...mockProperties]);
        toast({ title: 'Success', description: 'Property updated successfully.' });
      }
    } else {
      // Adding new property
      const newProperty = { ...newPropertyData, id: `prop-${Date.now()}` };
      mockProperties.unshift(newProperty);
      setProperties([...mockProperties]);
      toast({ title: 'Success', description: 'Property added successfully.' });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleOpenDeleteDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const handleRemoveProperty = () => {
    if (!selectedProperty) return;

    if (selectedProperty.tenantId) {
        toast({
            variant: "destructive",
            title: "Cannot Delete",
            description: "This property is occupied. Please remove the tenant first.",
        });
        setIsDeleteDialogOpen(false);
        return;
    }

    const propertyIndex = mockProperties.findIndex(p => p.id === selectedProperty.id);
    if (propertyIndex !== -1) {
      mockProperties.splice(propertyIndex, 1);
      setProperties([...mockProperties]);
      toast({ title: 'Success', description: 'Property removed successfully.' });
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedProperty(null);
  };

  return (
    <>
      <Card className="animate-fade-in-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>A list of all properties you own and their status.</CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={() => handleOpenForm(null)}>
            <PlusCircle className="h-4 w-4" />
            Add Property
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property, index) => {
                const tenant = property.tenantId ? getTenantForProperty(property.id) : null;
                return (
                  <TableRow key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={property.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={property.imageUrl}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>{formatCurrency(property.rent)}</TableCell>
                    <TableCell>
                      {tenant ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {tenant.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Vacant</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant ? 'secondary' : 'outline'}>
                        {tenant ? 'Occupied' : 'Vacant'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleOpenForm(property)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleOpenDeleteDialog(property)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Property Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{selectedProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the property. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rent" className="text-right">Rent (₹)</Label>
              <Input id="rent" type="number" value={rent} onChange={(e) => setRent(e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
               <Select onValueChange={(v) => setType(v as any)} value={type}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bedrooms" className="text-right">Bedrooms</Label>
              <Input id="bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bathrooms" className="text-right">Bathrooms</Label>
              <Input id="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="squareFootage" className="text-right">Area (sqft)</Label>
              <Input id="squareFootage" type="number" value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !address.trim() || !rent.trim() || !bedrooms.trim() || !bathrooms.trim() || !squareFootage.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the property "{selectedProperty?.title}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveProperty}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
