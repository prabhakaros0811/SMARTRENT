'use client';

import React from 'react';
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
import { mockProperties, getTenantForProperty } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { User } from 'lucide-react';

export default function OwnerPropertiesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Properties</CardTitle>
        <CardDescription>
          A list of all properties you own and their status.
        </CardDescription>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProperties.map(property => {
              const tenant = property.tenantId
                ? getTenantForProperty(property.id)
                : null;
              return (
                <TableRow key={property.id}>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
