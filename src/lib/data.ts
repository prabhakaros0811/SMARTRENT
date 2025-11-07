import type { User, Property, Tenant, RentPayment, Complaint, Bill, Announcement } from './types';

export const mockOwner: User = {
  id: 'owner-1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  role: 'owner',
  avatar: 'https://i.pravatar.cc/150?u=owner1',
  password: 'password',
};

export const mockOwners: User[] = [
    {
      id: 'owner-1',
      name: 'Rajesh Kumar',
      email: 'owner@emall.com',
      role: 'owner',
      avatar: 'https://i.pravatar.cc/150?u=owner1',
      password: 'password',
    },
]

export let mockProperties: Property[] = [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    title: 'Sunnyvale Apartment',
    address: '123, Sunshine Avenue, Bangalore',
    rent: 25000,
    type: 'Apartment',
    tenantId: 'tenant-1',
    imageUrl: 'https://picsum.photos/seed/prop1/800/600',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
  },
  {
    id: 'prop-2',
    ownerId: 'owner-1',
    title: 'Greenwood House',
    address: '456, Green Park, Delhi',
    rent: 45000,
    type: 'House',
    tenantId: 'tenant-2',
    imageUrl: 'https://picsum.photos/seed/prop2/800/600',
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 2000,
  },
  {
    id: 'prop-3',
    ownerId: 'owner-1',
    title: 'Lakeview Villa',
    address: '789, Lakeview Road, Mumbai',
    rent: 80000,
    type: 'Villa',
    tenantId: undefined,
    imageUrl: 'https://picsum.photos/seed/prop3/800/600',
    bedrooms: 4,
    bathrooms: 5,
    squareFootage: 3500,
  },
];

export let mockTenants: (Tenant & User)[] = [
  {
    id: 'tenant-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    propertyId: 'prop-1',
    ownerId: 'owner-1',
    role: 'tenant',
    avatar: 'https://i.pravatar.cc/150?u=tenant1',
    password: 'password',
  },
  {
    id: 'tenant-2',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    propertyId: 'prop-2',
    ownerId: 'owner-1',
    role: 'tenant',
    avatar: 'https://i.pravatar.cc/150?u=tenant2',
    password: 'password',
  },
];

export let mockRentPayments: RentPayment[] = [
  { id: 'rent-1', propertyId: 'prop-1', tenantId: 'tenant-1', month: 'July', year: 2024, amount: 25000, status: 'Paid', dueDate: '2024-07-05', paymentDate: '2024-07-03', paymentMethod: 'UPI' },
  { id: 'rent-2', propertyId: 'prop-1', tenantId: 'tenant-1', month: 'August', year: 2024, amount: 25000, status: 'Pending', dueDate: '2024-08-05' },
  { id: 'rent-3', propertyId: 'prop-2', tenantId: 'tenant-2', month: 'July', year: 2024, amount: 45000, status: 'Paid', dueDate: '2024-07-10', paymentDate: '2024-07-08', paymentMethod: 'Cash' },
  { id: 'rent-4', propertyId: 'prop-2', tenantId: 'tenant-2', month: 'August', year: 2024, amount: 45000, status: 'Processing', dueDate: '2024-08-10', paymentMethod: 'UPI' },
  { id: 'rent-5', propertyId: 'prop-1', tenantId: 'tenant-1', month: 'June', year: 2024, amount: 25000, status: 'Paid', dueDate: '2024-06-05', paymentDate: '2024-06-01', paymentMethod: 'UPI' },
];

export const mockBills: Bill[] = [
    { id: 'bill-1', propertyId: 'prop-1', tenantId: 'tenant-1', type: 'Electricity', amount: 1500, status: 'Paid', dueDate: '2024-07-15', month: 'July', year: 2024 },
    { id: 'bill-2', propertyId: 'prop-1', tenantId: 'tenant-1', type: 'Water', amount: 500, status: 'Pending', dueDate: '2024-08-15', month: 'August', year: 2024 },
]

export let mockComplaints: Complaint[] = [
  { id: 'comp-1', tenantId: 'tenant-1', propertyId: 'prop-1', message: 'Leaky faucet in the kitchen.', status: 'Pending', date: '2024-07-20', category: 'Maintenance' },
  { id: 'comp-2', tenantId: 'tenant-2', propertyId: 'prop-2', message: 'Noise complaint about neighbors.', status: 'Resolved', date: '2024-06-15', category: 'Civil' },
];

export let mockAnnouncements: Announcement[] = [
    { id: 'anno-1', message: 'The annual society meeting will be held on August 30th in the clubhouse.', date: '2024-07-25' },
    { id: 'anno-2', message: 'Please note that the water supply will be interrupted tomorrow from 10 AM to 1 PM for maintenance.', date: '2024-07-18' },
];

export const getTenantForProperty = (propertyId: string) => mockTenants.find(t => t.propertyId === propertyId);
export const getPropertyForTenant = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? mockProperties.find(p => p.id === tenant.propertyId) : undefined;
};
