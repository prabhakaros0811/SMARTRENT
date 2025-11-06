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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockComplaints, mockTenants } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import type { Complaint } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function OwnerComplaintsPage() {
  const { toast } = useToast();
  // Use state to make the component reactive to status changes
  const [complaints, setComplaints] = React.useState<Complaint[]>(mockComplaints);

  const handleStatusChange = (complaintId: string, newStatus: 'Pending' | 'Resolved') => {
    // Find the index of the complaint to update
    const complaintIndex = mockComplaints.findIndex(c => c.id === complaintId);
    if (complaintIndex !== -1) {
      // Update the status in the central mock data
      mockComplaints[complaintIndex].status = newStatus;
      
      // Update the local state to trigger a re-render
      setComplaints([...mockComplaints]);

      toast({
        title: 'Status Updated',
        description: `Complaint status changed to ${newStatus}.`,
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Complaints</CardTitle>
        <CardDescription>
          Review and manage all complaints submitted by your tenants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map(complaint => {
                const tenant = mockTenants.find(t => t.id === complaint.tenantId);
                return (
                    <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{tenant?.name}</TableCell>
                        <TableCell>{complaint.propertyId}</TableCell>
                        <TableCell>{formatDate(complaint.date)}</TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{complaint.message}</TableCell>
                        <TableCell>
                          <Badge variant={complaint.status === 'Pending' ? 'destructive' : 'secondary'}>
                            {complaint.status}
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
                                <DropdownMenuItem onSelect={() => handleStatusChange(complaint.id, 'Resolved')}>
                                Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(complaint.id, 'Pending')}>
                                Mark as Pending
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
