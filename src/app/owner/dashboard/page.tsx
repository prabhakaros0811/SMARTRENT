"use client";

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
import { Users, Home, IndianRupee, ShieldAlert } from 'lucide-react';
import { mockTenants, mockProperties, mockRentPayments, mockComplaints } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export default function OwnerDashboard() {
  const totalTenants = mockTenants.length;
  const totalProperties = mockProperties.length;
  const unpaidRents = mockRentPayments.filter(p => p.status === 'Pending').length;

  // Use state for complaints to ensure the component re-renders when mockData changes.
  const [complaints] = React.useState(mockComplaints);

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
