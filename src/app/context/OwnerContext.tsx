import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import type { Property, Tenant, Unit } from '../types/index';
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
  isLoadingProperties: boolean;
  refreshProperties: () => Promise<void>;
  refreshTenants: () => Promise<void>;
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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  const loadAdminOwners = async () => {
    try {
      const adminOwnersList = await userService.listMyOwners();

      // Also fetch pending requests so we can exclude them from the accepted owners list.
      // This is defensive: if the backend returns owners without an explicit flag,
      // we'll ensure pending owners are not treated as accepted.
      let pendingOwnerIds = new Set<string>();
      let pendingFetchSucceeded = true;
      try {
        const pending = await userService.listPendingOwnerRequests();
        pending.forEach(p => pendingOwnerIds.add(p.ownerId));
      } catch (e) {
        pendingFetchSucceeded = false;
        // If this fails, we avoid treating owners without an explicit accepted flag as accepted.
        console.warn('Failed to load pending owner requests; will require explicit accepted flag on owners', e);
      }

      const raw: any[] = adminOwnersList as any[];

      // If owners include an explicit accepted flag, prefer that. Otherwise exclude
      // any owner IDs that appear in the pending list.
      const ownersCandidates = raw.filter(o => {
        const explicit = (o.associationAccepted ?? o.adminAssociationAccepted);
        if (typeof explicit === 'boolean') {
          return explicit === true;
        }

        // No explicit flag present on the owner object.
        // If we couldn't fetch the pending list, be conservative and exclude the owner.
        if (!pendingFetchSucceeded) {
          return false;
        }

        return !pendingOwnerIds.has(o.id);
      });

      const owners: Owner[] = ownersCandidates.map(o => ({
        id: o.id,
        name: o.name,
        properties: 0,
        totalRevenue: '$0',
      }));

      setOwnersAvailable(owners);

      // Restore selected owner only if explicitly set in sessionStorage.
      const storedOwnerId = sessionStorage.getItem('selectedOwnerId');
      if (storedOwnerId) {
        const ownerToSelect = owners.find(o => o.id === storedOwnerId);
        if (ownerToSelect) {
          setCurrentOwnerState(ownerToSelect);
        }
      }
    } catch (err) {
      console.error('Failed to load admin owners', err);
    }
  };

  const fetchBackendData = useCallback(async (forceRefresh = false) => {
    try {
      const isAdmin = authService.getCurrentUserRole() === 'ADMIN';

      // If the user is an admin but the currentOwner hasn't been switched to a managed owner yet
      // (it still holds the admin's session ID from initial state), skip fetching.
      if (isAdmin && currentOwner.id === authService.getCurrentUserId()) {
        return;
      }

      setIsLoadingProperties(true);

      const fetchedProperties = await userService.listProperties(isAdmin ? currentOwner.id : authService.getCurrentUserId() ?? '');
      const fetchedApartments = await userService.listApartments(isAdmin ? currentOwner.id : authService.getCurrentUserId() ?? '');

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
          imageUrl: p.imageUrl ?? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
          description: '',
          units: unitsForProp,
          totalUnits: unitsForProp.length,
          occupiedUnits: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      setProperties(propertiesMapped);

      // Extract unique tenants from apartments - fetch grid data for each property
      const uniqueTenants: Record<string, Tenant> = {};

      for (const property of fetchedProperties) {
        try {
          const gridData = await userService.getPropertyApartmentsGrid(property.id, { forceRefresh });
          Object.values(gridData).forEach(floorApts => {
            Object.values(floorApts).forEach((apt: any) => {
              if (apt.tenant && apt.tenant.id) {
                uniqueTenants[apt.tenant.id] = {
                  id: apt.tenant.id,
                  ownerId: currentOwner.id,
                  name: apt.tenant.name || '',
                  email: apt.tenant.email || '',
                  phone: apt.tenant.phone || '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              }
            });
          });
        } catch (err) {
          console.error(`Failed to fetch grid data for property ${property.id}`, err);
        }
      }

      setTenants(Object.values(uniqueTenants));
    } catch(e) {
      console.error('Failed to load backend properties and tenants', e);
    } finally {
      setIsLoadingProperties(false);
    }
  }, [currentOwner.id]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAdminOwners();
    } else {
      const sessionOwner = buildSessionOwner();
      setCurrentOwnerState(sessionOwner);
      setOwnersAvailable([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBackendData();
  }, [currentOwner.id, fetchBackendData]);

  const setCurrentOwner = (owner: Owner) => {
    setCurrentOwnerState(owner);
    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    if (isAdmin) {
      sessionStorage.setItem('selectedOwnerId', owner.id);
    }
  };

  const refreshProperties = () => {
    return fetchBackendData();
  };

  const refreshTenants = async () => {
    await fetchBackendData(true);
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
      isLoadingProperties,
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
