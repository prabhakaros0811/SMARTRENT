'use client';

import React from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockTenants, mockProperties } from '@/lib/data';

export default function OwnerTenantsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tenants</CardTitle>
        <CardDescription>
          A list of all your current tenants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTenants.map(tenant => {
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
                  <TableCell>{tenant.email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
