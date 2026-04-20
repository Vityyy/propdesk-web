import { type Property, type Unit } from '../app/types/index';
import { tenantService } from './tenantService';
import userService from './userService';

const STORAGE_KEY = 'gdsi_properties';

// Centralizes property reads from localStorage for the current UI model.
const readProperties = (): Property[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Persists the current property list used by the frontend screens.
const writeProperties = (properties: Property[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
};

export const propertyService = {
  // Get all properties for an owner
  getPropertiesByOwner: (ownerId: string): Property[] => {
    const properties = readProperties();
    return properties.filter(p => p.ownerId === ownerId);
  },

  // Get single property
  getProperty: (propertyId: string): Property | null => {
    const properties = readProperties();
    return properties.find(p => p.id === propertyId) || null;
  },

  // Create new property
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const properties = readProperties();
    
    const newProperty: Property = {
      ...property,
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      units: property.units || [],
      totalUnits: property.units?.length || 0,
      occupiedUnits: property.units?.filter(u => u.status === 'occupied').length || 0,
    };

    properties.push(newProperty);
    writeProperties(properties);
    return newProperty;
  },

  // Stores backend-created properties locally so existing views can render them.
  storeProperty: (property: Property): Property => {
    const properties = readProperties();
    const index = properties.findIndex((storedProperty) => storedProperty.id === property.id);

    if (index === -1) {
      properties.push(property);
    } else {
      properties[index] = property;
    }

    writeProperties(properties);
    return property;
  },

  // Update property
  updateProperty: (propertyId: string, updates: Partial<Property>): Property | null => {
    const properties = readProperties();
    const index = properties.findIndex(p => p.id === propertyId);
    
    if (index === -1) return null;

    properties[index] = {
      ...properties[index],
      ...updates,
      id: properties[index].id,
      createdAt: properties[index].createdAt,
      updatedAt: new Date().toISOString(),
      totalUnits: properties[index].units?.length || 0,
      occupiedUnits: properties[index].units?.filter(u => u.status === 'occupied').length || 0,
    };

    writeProperties(properties);
    return properties[index];
  },

  // Delete property
  deleteProperty: (propertyId: string): boolean => {
    const properties = readProperties();
    const propertyToDelete = properties.find(p => p.id === propertyId);
    
    if (!propertyToDelete) return false;

    // Clean up all tenant assignments to this property
    tenantService.removePropertyAssignments(propertyToDelete.ownerId, propertyId);

    // Delete the property
    const filtered = properties.filter(p => p.id !== propertyId);
    writeProperties(filtered);
    return true;
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
          unitNumber: apt.name,
          type: units.find(u => u.unitNumber === apt.name)?.type || '1 Dormitorio',
          squareFeet: units.find(u => u.unitNumber === apt.name)?.squareFeet || 0,
          rentAmount: units.find(u => u.unitNumber === apt.name)?.rentAmount || 0,
          status: 'vacant' as const,
        }));

        return newUnits;
      }
      return [];
    } catch (error: any) {
      console.error('Error adding units:', error);
      throw error;
    }
  },

  // Update unit
  updateUnit: (propertyId: string, unitId: string, updates: Partial<Unit>): Unit | null => {
    const property = propertyService.getProperty(propertyId);
    if (!property) return null;

    const unitIndex = property.units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return null;

    property.units[unitIndex] = {
      ...property.units[unitIndex],
      ...updates,
      id: property.units[unitIndex].id,
    };

    propertyService.updateProperty(propertyId, property);
    return property.units[unitIndex];
  },

  // Delete unit
  deleteUnit: (propertyId: string, unitId: string): boolean => {
    const property = propertyService.getProperty(propertyId);
    if (!property) return false;

    const filtered = property.units.filter(u => u.id !== unitId);
    if (filtered.length === property.units.length) return false;

    property.units = filtered;
    propertyService.updateProperty(propertyId, property);
    return true;
  },

  // Assign tenant to unit
  assignTenantToUnit: (propertyId: string, unitId: string, tenantId: string): boolean => {
    const properties = readProperties();
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    if (propertyIndex === -1) return false;

    const unitIndex = properties[propertyIndex].units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return false;

    // Update the specific unit
    properties[propertyIndex].units[unitIndex] = {
      ...properties[propertyIndex].units[unitIndex],
      tenant: tenantId,
      status: 'occupied',
    };

    // Recalculate occupiedUnits for this property
    properties[propertyIndex] = {
      ...properties[propertyIndex],
      occupiedUnits: properties[propertyIndex].units.filter(u => u.status === 'occupied').length,
      updatedAt: new Date().toISOString(),
    };

    writeProperties(properties);
    return true;
  },

  // Unassign tenant from unit
  unassignTenantFromUnit: (propertyId: string, unitId: string): boolean => {
    const properties = readProperties();
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    if (propertyIndex === -1) return false;

    const unitIndex = properties[propertyIndex].units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return false;

    // Update the specific unit
    properties[propertyIndex].units[unitIndex] = {
      ...properties[propertyIndex].units[unitIndex],
      tenant: undefined,
      status: 'vacant',
    };

    // Recalculate occupiedUnits for this property
    properties[propertyIndex] = {
      ...properties[propertyIndex],
      occupiedUnits: properties[propertyIndex].units.filter(u => u.status === 'occupied').length,
      updatedAt: new Date().toISOString(),
    };

    writeProperties(properties);
    return true;
  },
};
