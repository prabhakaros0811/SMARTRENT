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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRentPayments, mockBills } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle } from 'lucide-react';
import type { RentPayment } from '@/lib/types';

export default function PaymentHistoryPage() {
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const loggedInTenantId = localStorage.getItem('loggedInTenantId');
    setTenantId(loggedInTenantId || 'tenant-1');
  }, []);

  const rentHistory = tenantId ? mockRentPayments.filter(p => p.tenantId === tenantId) : [];
  const billHistory = tenantId ? mockBills.filter(b => b.tenantId === tenantId) : [];

  const getBadgeVariant = (status: RentPayment['status']) => {
    switch (status) {
        case 'Paid': return 'secondary';
        case 'Pending': return 'destructive';
        case 'Processing': return 'default';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
  }

  if (!tenantId) {
    return <div className="flex justify-center items-center h-full"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          View your history of rent and bill payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rent">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rent">Rent Payments</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>
          <TabsContent value="rent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid On</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentHistory.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.month} {payment.year}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}
                    </TableCell>
                    <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="bills">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billHistory.map(bill => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.month} {bill.year}</TableCell>
                    <TableCell>{bill.type}</TableCell>
                    <TableCell>{formatCurrency(bill.amount)}</TableCell>
                    <TableCell>{formatDate(bill.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={bill.status === 'Paid' ? 'secondary' : 'destructive'}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
