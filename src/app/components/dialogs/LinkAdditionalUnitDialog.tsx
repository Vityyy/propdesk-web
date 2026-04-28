import { useState } from 'react';
import type { Property } from '../../types/index';
import { propertyService } from '../../../services/propertyService';
import { tenantService } from '../../../services/tenantService';

interface LinkAdditionalUnitDialogProps {
  isOpen: boolean;
  tenantId: string;
  properties: Property[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function LinkAdditionalUnitDialog({ 
  isOpen, 
  tenantId, 
  properties, 
  onClose, 
  onSuccess 
}: LinkAdditionalUnitDialogProps) {
  const [propertyId, setPropertyId] = useState('');
  const [unitId, setUnitId] = useState('');

  const availableUnits = propertyId
    ? propertyService.getProperty(propertyId)?.units.filter(u => !u.tenant) || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId || !unitId) {
      alert('Please select a property and a unit');
      return;
    }

    try {
      // Get the selected unit to obtain its rent amount
      const property = propertyService.getProperty(propertyId);
      if (!property) {
        alert('Property not found');
        return;
      }

      const unit = property.units.find(u => u.id === unitId);
      if (!unit) {
        alert('Unit not found');
        return;
      }

      // Assign tenant to this additional unit
      propertyService.assignTenantToUnit(propertyId, unitId, tenantId);

      // Add assignment to tenant
      tenantService.assignToUnit(tenantId, propertyId, unitId, unit.rentAmount);

      // Call success callback first (which handles refreshing)
      onSuccess?.();
      
      // Then close the dialog
      handleClose();
    } catch (error) {
      console.error('Error linking unit:', error);
      alert('Could not link unit');
    }
  };

  const handleClose = () => {
    setPropertyId('');
    setUnitId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            Link additional unit
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
              Property *
            </label>
            <select
              value={propertyId}
              onChange={(e) => {
                setPropertyId(e.target.value);
                setUnitId('');
              }}
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white"
            >
              <option value="" className="bg-black">
                Select a property
              </option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id} className="bg-black">
                  {prop.name}
                </option>
              ))}
            </select>
          </div>

          {propertyId && (
            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Available unit *
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white"
              >
                <option value="" className="bg-black">
                  Select a unit
                </option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id} className="bg-black">
                    Unit {unit.unitNumber} — {unit.type} — ${unit.rentAmount.toLocaleString()}/mo
                  </option>
                ))}
              </select>
              {availableUnits.length === 0 && (
                <p className="text-[#ff6b6b] text-sm mt-2">
                  No vacant units on this property
                </p>
              )}
            </div>
          )}

          {propertyId && unitId && (() => {
            const selectedUnit = availableUnits.find(u => u.id === unitId);
            return selectedUnit ? (
              <div className="p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[8px]">
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Monthly rent
                </label>
                <p className="text-white font-semibold text-lg">
                  ${selectedUnit.rentAmount.toLocaleString()}
                </p>
              </div>
            ) : null;
          })()}

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!propertyId || !unitId}
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Link unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
