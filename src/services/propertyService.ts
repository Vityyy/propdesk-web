import { type Property, type Unit } from '../app/types/index';
import { tenantService } from './tenantService';
import userService from './userService';

export const propertyService = {

  // Get single property
  getProperty: (propertyId: string): Property | null => {
    return null;
  },

  // Create new property
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const newProperty: Property = {
      ...property,
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      units: property.units || [],
      totalUnits: property.units?.length || 0,
      occupiedUnits: property.units?.filter(u => u.status === 'occupied').length || 0,
    };

    return newProperty;
  },

  // Stores backend-created properties locally so existing views can render them.
  storeProperty: (property: Property): Property => {
    return property;
  },

  // Update property
  updateProperty: (propertyId: string, updates: Partial<Property>): Property | null => {
    return null;
  },

  // Delete property
  deleteProperty: (propertyId: string): boolean => {
    return false;
  },

  // Add multiple units to property via API (no cache update)
  addUnits: async (propertyId: string, units: Omit<Unit, 'id'>[]): Promise<Unit[]> => {
    try {
      // Prepare data as ApartmentCreateRequest[] (only name and propertyId)
      const apartmentsData: Array<{ name: string; propertyId: string; amount_due: number }> = units.map(unit => ({
        name: unit.unitNumber,
        propertyId,
        amount_due: unit.rentAmount,
        // not part of ApartmentCreateRequest
        // type: unit.type,
        // squareFeet: unit.squareFeet,
      }));

      const response = await userService.createApartments(apartmentsData);

      // Return created units
      if (response && Array.isArray(response) && response.length > 0) {
        const newUnits: Unit[] = response.map(apt => ({
          id: apt.id,
          unitNumber: String(apt.number),
          type: units.find(u => u.unitNumber === String(apt.number))?.type || '1 Dormitorio',
          squareFeet: units.find(u => u.unitNumber === String(apt.number))?.squareFeet || 0,
          rentAmount: units.find(u => u.unitNumber === String(apt.number))?.rentAmount || 0,
          status: 'vacant' as const,
        }));

        return newUnits;
      }
      return [];
    } catch (error) {
      console.error('Error adding units:', error);
      throw error;
    }
  },

  // Update unit
  updateUnit: (propertyId: string, unitId: string, updates: Partial<Unit>): Unit | null => {
    return null;
  },

  // Delete unit
  deleteUnit: (propertyId: string, unitId: string): boolean => {
    return false;
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
