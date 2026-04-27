import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
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
  const [ownersAvailable, setOwnersAvailable] = useState<Owner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    tenantService.getTenantsByOwner(buildSessionOwner().id),
  );

  const loadAdminOwners = async () => {
    try {
      const adminOwnersList = await userService.listMyOwners();
      const owners: Owner[] = adminOwnersList.map(o => ({
        id: o.id,
        name: o.name,
        properties: 0,
        totalRevenue: '$0',
      }));
      setOwnersAvailable(owners);

      // Restore selected owner from sessionStorage or pick first
      const storedOwnerId = sessionStorage.getItem('selectedOwnerId');
      const ownerToSelect = owners.find(o => o.id === storedOwnerId) || owners[0];
      if (ownerToSelect) {
        setCurrentOwnerState(ownerToSelect);
      }
    } catch (err) {
      console.error('Failed to load admin owners', err);
    }
  };

  const fetchBackendData = useCallback(async () => {
    try {
      const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
      
      // If the user is an admin but the currentOwner hasn't been switched to a managed owner yet
      // (it still holds the admin's session ID from initial state), skip fetching.
      if (isAdmin && currentOwner.id === authService.getCurrentUserId()) {
        return;
      }

      const fetchedProperties = await userService.listProperties(isAdmin ? currentOwner.id : undefined);
      const fetchedApartments = await userService.listApartments();

      const propertiesMapped: Property[] = fetchedProperties.map(p => {
        const unitsForProp = fetchedApartments
            .filter(a => a.propertyId === p.id)
            .map(a => ({
               id: a.id,
               unitNumber: String(a.number),
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
      setProperties(propertyService.getPropertiesByOwner(currentOwner.id));
    }
  }, [currentOwner.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    if (isAdmin) {
      loadAdminOwners();
    } else {
      const sessionOwner = buildSessionOwner();
      setCurrentOwnerState(sessionOwner);
      setOwnersAvailable([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBackendData();
    setTenants(tenantService.getTenantsByOwner(currentOwner.id));
  }, [currentOwner.id, fetchBackendData]);

  const setCurrentOwner = (owner: Owner) => {
    setCurrentOwnerState(owner);
    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    if (isAdmin) {
      sessionStorage.setItem('selectedOwnerId', owner.id);
    }
  };

  const refreshProperties = () => {
    fetchBackendData();
  };

  const refreshTenants = () => {
    setTenants(tenantService.getTenantsByOwner(currentOwner.id));
  };

  const owners = useMemo(() => {
    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    return isAdmin ? ownersAvailable : [currentOwner];
  }, [currentOwner, ownersAvailable]);

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
