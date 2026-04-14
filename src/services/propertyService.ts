import { type Property, type Unit } from '../app/types/index';
import { tenantService } from './tenantService';

const STORAGE_KEY = 'gdsi_properties';

export const propertyService = {
  // Get all properties for an owner
  getPropertiesByOwner: (ownerId: string): Property[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const properties: Property[] = JSON.parse(stored);
    return properties.filter(p => p.ownerId === ownerId);
  },

  // Get single property
  getProperty: (propertyId: string): Property | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const properties: Property[] = JSON.parse(stored);
    return properties.find(p => p.id === propertyId) || null;
  },

  // Create new property
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const properties: Property[] = stored ? JSON.parse(stored) : [];
    
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    return newProperty;
  },

  // Update property
  updateProperty: (propertyId: string, updates: Partial<Property>): Property | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const properties: Property[] = JSON.parse(stored);
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    return properties[index];
  },

  // Delete property
  deleteProperty: (propertyId: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const properties: Property[] = JSON.parse(stored);
    const propertyToDelete = properties.find(p => p.id === propertyId);
    
    if (!propertyToDelete) return false;

    // Clean up all tenant assignments to this property
    tenantService.removePropertyAssignments(propertyToDelete.ownerId, propertyId);

    // Delete the property
    const filtered = properties.filter(p => p.id !== propertyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Add unit to property
  addUnit: (propertyId: string, unit: Omit<Unit, 'id'>): Unit | null => {
    const property = propertyService.getProperty(propertyId);
    if (!property) return null;

    const newUnit: Unit = {
      ...unit,
      id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    property.units.push(newUnit);
    propertyService.updateProperty(propertyId, property);
    
    return newUnit;
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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const properties: Property[] = JSON.parse(stored);
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    return true;
  },

  // Unassign tenant from unit
  unassignTenantFromUnit: (propertyId: string, unitId: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const properties: Property[] = JSON.parse(stored);
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    return true;
  },
};
