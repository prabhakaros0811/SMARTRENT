'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Bed, Bath, IndianRupee, Calendar, FileText, LoaderCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { getPropertyForTenant, mockRentPayments, mockBills } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { Property, RentPayment } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TenantDashboard() {
  const { toast } = useToast();
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  const [property, setProperty] = React.useState<Property | undefined>(undefined);
  const [rentPayments, setRentPayments] = React.useState<RentPayment[]>([]);
  const [bills, setBills] = React.useState(mockBills);
  
  const [isPayDialogOpen, setIsPayDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<RentPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'UPI' | 'Cash' | undefined>(undefined);


  React.useEffect(() => {
    const loggedInTenantId = localStorage.getItem('loggedInTenantId');
    const id = loggedInTenantId || 'tenant-1';
    setTenantId(id);
    const prop = getPropertyForTenant(id);
    setProperty(prop);
    setRentPayments(mockRentPayments.filter(p => p.tenantId === id));
    setBills(mockBills.filter(b => b.tenantId === id));
  }, []);

  const handleOpenPayDialog = (payment: RentPayment) => {
    setSelectedPayment(payment);
    setIsPayDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPayment || !paymentMethod) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a payment method.'});
        return;
    }

    const paymentIndex = mockRentPayments.findIndex(p => p.id === selectedPayment.id);
    if (paymentIndex !== -1) {
        mockRentPayments[paymentIndex].status = 'Processing';
        mockRentPayments[paymentIndex].paymentMethod = paymentMethod;

        // Force re-render
        setRentPayments([...mockRentPayments.filter(p => p.tenantId === tenantId)]);
    }

    toast({ title: 'Payment Submitted', description: 'Your payment is now being processed by the owner.' });
    setIsPayDialogOpen(false);
    setSelectedPayment(null);
    setPaymentMethod(undefined);
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

  const pendingRent = rentPayments.find(p => p.status === 'Pending' || p.status === 'Rejected');
  const recentBill = bills.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0];

  if (!tenantId || !property) {
    return <div className="flex justify-center items-center h-full"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              data-ai-hint="apartment interior"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">{property.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {property.address}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                <IndianRupee className="h-6 w-6 text-amber-500 mb-1" />
                <span className="text-sm text-muted-foreground">Rent</span>
                <span className="font-bold text-lg">{formatCurrency(property.rent)}</span>
            </div>
             <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                <Bed className="h-6 w-6 text-amber-500 mb-1" />
                <span className="text-sm text-muted-foreground">Bedrooms</span>
                <span className="font-bold text-lg">{property.bedrooms}</span>
            </div>
             <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                <Bath className="h-6 w-6 text-amber-500 mb-1" />
                <span className="text-sm text-muted-foreground">Bathrooms</span>
                <span className="font-bold text-lg">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary">
                <FileText className="h-6 w-6 text-amber-500 mb-1" />
                <span className="text-sm text-muted-foreground">Area</span>
                <span className="font-bold text-lg">{property.squareFootage} sqft</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Your latest payment statuses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRent ? (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Rent - {pendingRent.month} {pendingRent.year}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due by {formatDate(pendingRent.dueDate)}
                    </p>
                  </div>
                   <Badge variant={getBadgeVariant(pendingRent.status)}>
                    {pendingRent.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold">{formatCurrency(pendingRent.amount)}</p>
                    {(pendingRent.status === 'Pending' || pendingRent.status === 'Rejected') && (
                         <Button size="sm" variant="accent" onClick={() => handleOpenPayDialog(pendingRent)}>
                            <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                        </Button>
                    )}
                </div>
              </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending rent payments. You're all caught up!</p>
            )}
            <Separator />
            {recentBill && (
                <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{recentBill.type} Bill - {recentBill.month}</p>
                     <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due by {formatDate(recentBill.dueDate)}
                    </p>
                  </div>
                  <Badge variant={recentBill.status === 'Paid' ? 'secondary' : 'destructive'}>
                    {recentBill.status}
                  </Badge>
                </div>
                 <p className="text-right font-bold mt-1">{formatCurrency(recentBill.amount)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Payment Dialog */}
     <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pay Rent: {formatCurrency(selectedPayment?.amount || 0)}</DialogTitle>
                <DialogDescription>
                    Select your payment method. The owner will be notified to confirm the payment.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <RadioGroup onValueChange={(value: 'UPI' | 'Cash') => setPaymentMethod(value)} defaultValue={paymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-md p-4 has-[:checked]:bg-secondary has-[:checked]:border-amber-500">
                        <RadioGroupItem value="UPI" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-3 text-base cursor-pointer">
                            <QrCode className="h-5 w-5"/> Pay with UPI
                        </Label>
                    </div>
                     <div className="flex items-center space-x-2 border rounded-md p-4 has-[:checked]:bg-secondary has-[:checked]:border-amber-500">
                        <RadioGroupItem value="Cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-3 text-base cursor-pointer">
                           <Banknote className="h-5 w-5" /> Pay with Cash
                        </Label>
                    </div>
                </RadioGroup>

                 {paymentMethod === 'UPI' && (
                    <div className='mt-4 p-4 bg-muted rounded-md text-center'>
                        <p className="text-sm text-muted-foreground">Scan the QR code or use the UPI ID:</p>
                        <p className="font-mono mt-1">owner@okhdfcbank</p>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePaymentSubmit} variant="accent" disabled={!paymentMethod}>I have paid</Button>
            </DialogFooter>
        </DialogContent>
     </Dialog>
    </>
  );
}
