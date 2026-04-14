import { type Tenant, type TenantAssignment } from '../app/types/index';

const STORAGE_KEY = 'gdsi_tenants';

export const tenantService = {
  // Get all tenants for an owner
  getTenantsByOwner: (ownerId: string): Tenant[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const tenants: Tenant[] = JSON.parse(stored);
    return tenants.filter(t => t.ownerId === ownerId);
  },

  // Get single tenant
  getTenant: (tenantId: string): Tenant | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const tenants: Tenant[] = JSON.parse(stored);
    return tenants.find(t => t.id === tenantId) || null;
  },

  // Check if tenant already exists by ownerId + documentNumber
  tenantExists: (ownerId: string, documentNumber: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const tenants: Tenant[] = JSON.parse(stored);
    return tenants.some(
      t => t.ownerId === ownerId && t.documentNumber === documentNumber
    );
  },

  // Create new tenant
  createTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'assignedProperties'>): Tenant => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tenants: Tenant[] = stored ? JSON.parse(stored) : [];

    const newTenant: Tenant = {
      ...tenant,
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assignedProperties: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tenants.push(newTenant);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
    return newTenant;
  },

  // Update tenant
  updateTenant: (tenantId: string, updates: Partial<Tenant>): Tenant | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const tenants: Tenant[] = JSON.parse(stored);
    const index = tenants.findIndex(t => t.id === tenantId);

    if (index === -1) return null;

    tenants[index] = {
      ...tenants[index],
      ...updates,
      id: tenants[index].id,
      createdAt: tenants[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
    return tenants[index];
  },

  // Delete tenant
  deleteTenant: (tenantId: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const tenants: Tenant[] = JSON.parse(stored);
    const filtered = tenants.filter(t => t.id !== tenantId);

    if (filtered.length === tenants.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Assign tenant to property/unit
  assignToUnit: (tenantId: string, propertyId: string, unitId: string, rentAmount: number): TenantAssignment | null => {
    const tenant = tenantService.getTenant(tenantId);
    if (!tenant) return null;

    const assignment: TenantAssignment = {
      propertyId,
      unitId,
      rentAmount,
      startDate: new Date().toISOString(),
      status: 'active',
      paymentStatus: 'pending',
    };

    tenant.assignedProperties.push(assignment);
    tenantService.updateTenant(tenantId, tenant);

    return assignment;
  },

  // Update payment status for an assignment
  updatePaymentStatus: (tenantId: string, propertyId: string, unitId: string, paymentStatus: 'paid' | 'pending' | 'overdue' | 'partial'): boolean => {
    const tenant = tenantService.getTenant(tenantId);
    if (!tenant) return false;

    const assignment = tenant.assignedProperties.find(
      a => a.propertyId === propertyId && a.unitId === unitId
    );

    if (!assignment) return false;

    assignment.paymentStatus = paymentStatus;
    tenantService.updateTenant(tenantId, tenant);
    return true;
  },

  // Unassign tenant from unit
  unassignFromUnit: (tenantId: string, propertyId: string, unitId: string): boolean => {
    const tenant = tenantService.getTenant(tenantId);
    if (!tenant) return false;

    const index = tenant.assignedProperties.findIndex(
      a => a.propertyId === propertyId && a.unitId === unitId
    );

    if (index === -1) return false;

    tenant.assignedProperties[index].status = 'inactive';
    tenant.assignedProperties[index].endDate = new Date().toISOString();

    tenantService.updateTenant(tenantId, tenant);
    return true;
  },

  // Remove all assignments to a property when it's deleted
  removePropertyAssignments: (ownerId: string, propertyId: string): void => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const tenants: Tenant[] = JSON.parse(stored);
    const ownerTenants = tenants.filter(t => t.ownerId === ownerId);

    ownerTenants.forEach(tenant => {
      tenant.assignedProperties = tenant.assignedProperties.filter(
        a => a.propertyId !== propertyId
      );
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
  },

  // Get tenant's active assignments
  getActiveAssignments: (tenantId: string): TenantAssignment[] => {
    const tenant = tenantService.getTenant(tenantId);
    if (!tenant) return [];
    return tenant.assignedProperties.filter(a => a.status === 'active');
  },
};
