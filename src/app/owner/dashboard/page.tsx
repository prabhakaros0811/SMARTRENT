"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, Home, IndianRupee, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { mockTenants, mockProperties, mockRentPayments, mockComplaints } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { RentPayment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function OwnerDashboard() {
  const { toast } = useToast();
  const totalTenants = mockTenants.length;
  const totalProperties = mockProperties.length;
  
  // Use state for reactive updates
  const [complaints, setComplaints] = React.useState(mockComplaints);
  const [rentPayments, setRentPayments] = React.useState(mockRentPayments);

  const unpaidRents = rentPayments.filter(p => p.status === 'Pending').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;

  const chartData = [
    { month: 'Mar', paid: 45000, pending: 25000 },
    { month: 'Apr', paid: 70000, pending: 0 },
    { month: 'May', paid: 25000, pending: 45000 },
    { month: 'Jun', paid: 70000, pending: 0 },
    { month: 'Jul', paid: 25000, pending: 45000 },
  ];

  const chartConfig = {
    paid: { label: 'Paid', color: 'hsl(var(--chart-2))' },
    pending: { label: 'Pending', color: 'hsl(var(--chart-5))' },
  };

  const handlePaymentConfirmation = (paymentId: string, action: 'confirm' | 'reject') => {
    const paymentIndex = mockRentPayments.findIndex(p => p.id === paymentId);
    if (paymentIndex !== -1) {
        if (action === 'confirm') {
            mockRentPayments[paymentIndex].status = 'Paid';
            mockRentPayments[paymentIndex].paymentDate = new Date().toISOString();
            toast({ title: 'Payment Confirmed', description: 'The rent status has been updated to "Paid".' });
        } else {
            mockRentPayments[paymentIndex].status = 'Pending'; // Or a new 'Rejected' status
            toast({ variant: 'destructive', title: 'Payment Rejected', description: 'The rent status has been reverted to "Pending".' });
        }
        setRentPayments([...mockRentPayments]);
    }
  };
  
  const getBadgeVariant = (status: RentPayment['status']) => {
    switch (status) {
        case 'Paid': return 'secondary';
        case 'Pending': return 'destructive';
        case 'Processing': return 'default';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
  }

  const paymentsToConfirm = rentPayments.filter(p => p.status === 'Processing');

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Rents</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidRents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComplaints}</div>
          </CardContent>
        </Card>
      </div>

       {paymentsToConfirm.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>Awaiting Payment Confirmation</CardTitle>
                <CardDescription>Review payments submitted by tenants and confirm their receipt.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentsToConfirm.map(payment => (
                            <TableRow key={payment.id}>
                                <TableCell>{mockTenants.find(t => t.id === payment.tenantId)?.name}</TableCell>
                                <TableCell>{payment.month} {payment.year}</TableCell>
                                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{payment.paymentMethod}</Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="secondary" onClick={() => handlePaymentConfirmation(payment.id, 'confirm')}>
                                        <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                                    </Button>
                                     <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handlePaymentConfirmation(payment.id, 'reject')}>
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rent Overview</CardTitle>
            <CardDescription>Monthly paid vs. pending rent amounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickFormatter={(value) => formatCurrency(Number(value)).slice(0, -3)} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                  <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>A list of recent complaints from tenants.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.slice(0, 4).map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{mockTenants.find(t => t.id === complaint.tenantId)?.name}</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>{formatDate(complaint.date)}</TableCell>
                    <TableCell>
                      <Badge variant={complaint.status === 'Pending' ? 'destructive' : 'secondary'}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
