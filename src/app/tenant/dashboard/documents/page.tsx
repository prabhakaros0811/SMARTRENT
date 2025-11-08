'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockDocuments } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { LoaderCircle, UploadCloud, File, Trash2 } from 'lucide-react';
import type { Document } from '@/lib/types';
import { Label } from '@/components/ui/label';

export default function DocumentsPage() {
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loggedInTenantId = localStorage.getItem('loggedInTenantId');
    const id = loggedInTenantId || 'tenant-1';
    setTenantId(id);
    setDocuments(mockDocuments.filter(d => d.tenantId === id));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !tenantId) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        tenantId,
        name: selectedFile.name,
        uploadDate: new Date().toISOString(),
        url: '#', // Placeholder URL
      };

      mockDocuments.unshift(newDocument);
      setDocuments(prev => [newDocument, ...prev]);
      
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: 'Document Uploaded',
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    }, 1500);
  };
  
   const handleDelete = (docId: string) => {
    const docIndex = mockDocuments.findIndex(d => d.id === docId);
    if(docIndex !== -1) {
        mockDocuments.splice(docIndex, 1);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        toast({
            title: 'Document Removed',
            description: `The selected document has been removed.`,
        });
    }
   };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3 animate-fade-in-up">
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            A list of all the documents you have uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <TableRow key={doc.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No documents uploaded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 animate-fade-in-up animation-delay-200">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Upload documents like Aadhar, PAN, or Passport.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="document-upload">Select File</Label>
                 <Input 
                    id="document-upload" 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="pt-2 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
             </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="accent" onClick={handleUpload} disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload Document
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
