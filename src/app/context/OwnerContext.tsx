import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Property, Tenant } from '../types/index';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';

interface Owner {
  id: string;
  name: string;
  properties: number;
  totalRevenue: string;
}

interface OwnerContextType {
  currentOwner: Owner;
  setCurrentOwner: (owner: Owner) => void;
  owners: Owner[];
  properties: Property[];
  tenants: Tenant[];
  refreshProperties: () => void;
  refreshTenants: () => void;
}

const defaultOwners: Owner[] = [
  { id: '1', name: 'John Martinez', properties: 3, totalRevenue: '$105,000' },
  { id: '2', name: 'Sarah Johnson', properties: 2, totalRevenue: '$70,000' },
  { id: '3', name: 'Michael Chen', properties: 4, totalRevenue: '$143,000' },
  { id: '4', name: 'Emily Rodriguez', properties: 1, totalRevenue: '$28,000' },
];

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [currentOwner, setCurrentOwnerState] = useState<Owner>(defaultOwners[0]);
  const [properties, setProperties] = useState<Property[]>(() =>
    propertyService.getPropertiesByOwner(defaultOwners[0].id),
  );
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    tenantService.getTenantsByOwner(defaultOwners[0].id),
  );

  const setCurrentOwner = (owner: Owner) => {
    setCurrentOwnerState(owner);
    setProperties(propertyService.getPropertiesByOwner(owner.id));
    setTenants(tenantService.getTenantsByOwner(owner.id));
  };

  const refreshProperties = () => {
    setProperties(propertyService.getPropertiesByOwner(currentOwner.id));
  };

  const refreshTenants = () => {
    setTenants(tenantService.getTenantsByOwner(currentOwner.id));
  };

  return (
    <OwnerContext.Provider value={{ 
      currentOwner, 
      setCurrentOwner, 
      owners: defaultOwners,
      properties,
      tenants,
      refreshProperties,
      refreshTenants,
    }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const context = useContext(OwnerContext);
  if (context === undefined) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
}
