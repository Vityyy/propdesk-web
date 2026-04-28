import { type Property, type Unit } from '../app/types/index';
import { tenantService } from './tenantService';
import userService from './userService';

export const propertyService = {

  // Get single property
  getProperty: (propertyId: string): Property | null => {
    return null;
  },

  // Assign tenant to unit
  assignTenantToUnit: (propertyId: string, unitId: string, tenantId: string): boolean => {
    return false;
  },

  // Unassign tenant from unit
  unassignTenantFromUnit: (propertyId: string, unitId: string): boolean => {
    return false;
  },
};
