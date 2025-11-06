'use client';

import { useState } from 'react';
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
import { mockComplaints } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Send, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Complaint } from '@/lib/types';

export default function ComplaintsPage() {
  const { toast } = useToast();
  const tenantId = 'tenant-1'; // Mock logged-in tenant
  const propertyId = 'prop-1'; // Mock property for the tenant

  // Local state for complaints to re-render the list on submission
  const [complaints, setComplaints] = useState<Complaint[]>(
    mockComplaints.filter(c => c.tenantId === tenantId)
  );
  
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Please select a category and enter a message.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
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

      // Add to the beginning of the mock data array
      mockComplaints.unshift(newComplaint); 

      // Update local state to re-render the list
      setComplaints(prev => [newComplaint, ...prev]);

      // Reset form
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
      <div className="lg:col-span-3">
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
                {complaints.map(complaint => (
                  <TableRow key={complaint.id}>
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

      <div className="lg:col-span-2">
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
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
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