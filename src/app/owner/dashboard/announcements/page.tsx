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
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockAnnouncements } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import type { Announcement } from '@/lib/types';
import { Megaphone, Send, LoaderCircle } from 'lucide-react';

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendAnnouncement = () => {
    if (!newAnnouncement.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Announcement message cannot be empty.',
      });
      return;
    }
    setIsSending(true);

    setTimeout(() => {
      const announcement: Announcement = {
        id: `anno-${Date.now()}`,
        message: newAnnouncement,
        date: new Date().toISOString(),
      };

      mockAnnouncements.unshift(announcement);
      setAnnouncements([...mockAnnouncements]);
      setNewAnnouncement('');

      toast({
        title: 'Announcement Sent',
        description: 'Your message has been broadcast to all tenants.',
      });
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Send New Announcement</CardTitle>
                <CardDescription>
                Broadcast a message to all of your tenants.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your announcement here..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            rows={5}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendAnnouncement} className="w-full" disabled={isSending || !newAnnouncement.trim()}>
            {isSending ? (
              <LoaderCircle className="mr-2 animate-spin" />
            ) : (
              <Send className="mr-2" />
            )}
            Send to All Tenants
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="animate-fade-in-up animation-delay-200">
        <CardHeader>
          <CardTitle>Sent Announcements</CardTitle>
          <CardDescription>
            A history of all the announcements you've sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement, index) => (
                <TableRow key={announcement.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <TableCell className="whitespace-nowrap w-[120px] align-top">
                    {formatDate(announcement.date)}
                  </TableCell>
                  <TableCell>{announcement.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
