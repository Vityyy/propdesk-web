// Property types
export interface Unit {
  id: string;
  unitNumber: string;
  type: string; // e.g., "1 Bedroom", "2 Bedroom", "Studio"
  squareFeet: number;
  rentAmount: number;
  tenant?: string; // tenant ID
  status: 'occupied' | 'vacant' | 'maintenance';
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  imageUrl: string;
  description?: string;
  units: Unit[];
  totalUnits: number;
  occupiedUnits: number;
  createdAt: string;
  updatedAt: string;
}

// Tenant types
export interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantAssignment {
  propertyId: string;
  unitId: string;
  startDate: string;
  endDate?: string;
  rentAmount: number;
  status: 'active' | 'inactive' | 'pending';
  paymentStatus: PaymentStatus;
}

// Payment types
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
}
