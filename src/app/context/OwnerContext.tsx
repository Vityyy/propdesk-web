import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Property, Tenant, Unit } from '../types/index';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';
import authService from '../../services/authService';
import { userService } from '../../services/userService';
import { useAuth } from './AuthContext';

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

const fallbackOwner: Owner = {
  id: 'owner-session',
  name: 'Current Owner',
  properties: 0,
  totalRevenue: '$0',
}

const buildSessionOwner = (): Owner => ({
  ...fallbackOwner,
  id: authService.getCurrentUserId() ?? fallbackOwner.id,
});

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [currentOwner, setCurrentOwnerState] = useState<Owner>(() => buildSessionOwner());
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    tenantService.getTenantsByOwner(buildSessionOwner().id),
  );

  const fetchBackendData = async () => {
    try {
      const fetchedProperties = await userService.listProperties();
      const fetchedApartments = await userService.listApartments();

      const propertiesMapped: Property[] = fetchedProperties.map(p => {
        const unitsForProp = fetchedApartments
            .filter(a => a.propertyId === p.id)
            .map(a => ({
               id: a.id,
               unitNumber: a.name,
               type: 'Default',
               squareFeet: 0,
               rentAmount: 0,
               status: 'vacant'
            } as Unit));

        return {
          id: p.id,
          name: p.name,
          address: p.address,
          ownerId: p.ownerId,
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
          description: '',
          units: unitsForProp,
          totalUnits: unitsForProp.length,
          occupiedUnits: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      setProperties(propertiesMapped);
    } catch(e) {
      console.error('Failed to load backend properties', e);
      setProperties(propertyService.getPropertiesByOwner(buildSessionOwner().id));
    }
  };

  useEffect(() => {
    const sessionOwner = buildSessionOwner();
    setCurrentOwnerState(sessionOwner);
    fetchBackendData();
    setTenants(tenantService.getTenantsByOwner(sessionOwner.id));
  }, [isAuthenticated]);

  const setCurrentOwner = (owner: Owner) => {
    setCurrentOwnerState(owner);
    fetchBackendData();
    setTenants(tenantService.getTenantsByOwner(owner.id));
  };

  const refreshProperties = () => {
    fetchBackendData();
  };

  const refreshTenants = () => {
    setTenants(tenantService.getTenantsByOwner(currentOwner.id));
  };

  const owners = useMemo(() => [currentOwner], [currentOwner]);

  return (
    <OwnerContext.Provider value={{ 
      currentOwner, 
      setCurrentOwner, 
      owners,
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
