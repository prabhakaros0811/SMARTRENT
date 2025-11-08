'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockComplaints, getPropertyForTenant } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Send, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Complaint } from '@/lib/types';

export default function ComplaintsPage() {
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    const loggedInTenantId = localStorage.getItem('loggedInTenantId');
    setTenantId(loggedInTenantId || 'tenant-1');
  }, []);
  
  const property = tenantId ? getPropertyForTenant(tenantId) : null;
  const propertyId = property?.id;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  useEffect(() => {
    if(tenantId) {
      setComplaints(mockComplaints.filter(c => c.tenantId === tenantId))
    }
  }, [tenantId]);

  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Please select a category and enter a message.',
      });
      return;
    }
    if (!tenantId || !propertyId) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not identify tenant or property. Please log in again.',
        });
        return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newComplaint: Complaint = {
        id: `comp-${Date.now()}`,
        tenantId,
        propertyId,
        category: category as 'Maintenance' | 'Civil',
        message,
        status: 'Pending',
        date: new Date().toISOString(),
      };

      mockComplaints.unshift(newComplaint); 

      setComplaints(prev => [newComplaint, ...prev]);

      setCategory('');
      setMessage('');
      setIsSubmitting(false);

      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been sent to the property owner.',
      });
    }, 1000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle>Your Complaints</CardTitle>
            <CardDescription>
              Track the status of your submitted complaints.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint, index) => (
                  <TableRow key={complaint.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <TableCell>{formatDate(complaint.date)}</TableCell>
                    <TableCell>{complaint.category}</TableCell>
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

      <div className="lg:col-span-2 animate-fade-in-up animation-delay-200">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Complaint</CardTitle>
              <CardDescription>
                Let your property owner know about any issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe the issue in detail..." value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" variant="accent" disabled={isSubmitting || !category || !message.trim()}>
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Complaint
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
