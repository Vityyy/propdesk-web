import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Property, Tenant } from '../types/index';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';
import authService from '../../services/authService';
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
};

// Derives the current owner identity from the authenticated session token.
const buildSessionOwner = (): Owner => ({
  ...fallbackOwner,
  id: authService.getCurrentUserId() ?? fallbackOwner.id,
});

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [currentOwner, setCurrentOwnerState] = useState<Owner>(() => buildSessionOwner());
  const [properties, setProperties] = useState<Property[]>(() =>
    propertyService.getPropertiesByOwner(buildSessionOwner().id),
  );
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    tenantService.getTenantsByOwner(buildSessionOwner().id),
  );

  useEffect(() => {
    const sessionOwner = buildSessionOwner();

    setCurrentOwnerState(sessionOwner);
    setProperties(propertyService.getPropertiesByOwner(sessionOwner.id));
    setTenants(tenantService.getTenantsByOwner(sessionOwner.id));
  }, [isAuthenticated]);

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
