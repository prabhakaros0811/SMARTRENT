export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'tenant';
  avatar: string;
  password?: string;
}

export interface Property {
  id?: string;
  ownerId: string;
  title: string;
  address: string;
  rent: number;
  type: 'Apartment' | 'House' | 'Villa';
  tenantId?: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  propertyId: string;
  ownerId: string;
  password?: string;
}

export interface RentPayment {
  id: string;
  propertyId: string;
  tenantId: string;
  month: string;
  year: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Processing' | 'Rejected';
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'UPI' | 'Cash';
}

export interface Bill {
    id: string;
    propertyId: string;
    tenantId: string;
    type: 'Water' | 'Electricity';
    amount: number;
    status: 'Paid' | 'Pending';
    dueDate: string;
    month: string;
    year: number;
}

export interface Complaint {
  id: string;
  tenantId: string;
  propertyId: string;
  message: string;
  status: 'Pending' | 'Resolved';
  date: string;
  category: 'Civil' | 'Maintenance';
}

export interface Announcement {
  id: string;
  message: string;
  date: string;
}

export interface Document {
  id: string;
  tenantId: string;
  name: string;
  uploadDate: string;
  url: string; // For mock purposes, will be a placeholder
}
