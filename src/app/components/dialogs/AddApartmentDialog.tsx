import { useState } from 'react';
import type { Unit } from '../../types/index';
import { propertyService } from '../../../services/propertyService';

interface AddApartmentDialogProps {
  isOpen: boolean;
  propertyId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddApartmentDialog({ 
  isOpen, 
  propertyId, 
  onClose, 
  onSuccess 
}: AddApartmentDialogProps) {
  const [units, setUnits] = useState<Omit<Unit, 'id'>[]>([]);
  const [unitConfig, setUnitConfig] = useState({
    startNumber: '',
    quantity: '',
    type: '',
    squareFeet: '',
    rentAmount: '',
  });

  // Resolve property once at component level (single lookup)
  const property = propertyService.getProperty(propertyId);

  const generateUnits = () => {
    if (!unitConfig.startNumber || !unitConfig.quantity || !unitConfig.type) {
      alert('Please complete all required configuration fields');
      return;
    }

    const startNum = parseInt(unitConfig.startNumber);
    const quantity = parseInt(unitConfig.quantity);

    if (isNaN(startNum) || isNaN(quantity) || quantity <= 0) {
      alert('Starting number and quantity must be valid numbers');
      return;
    }

    // Use property from component state (no additional API call)
    if (!property) {
      alert('Property not found');
      return;
    }

    const existingNumbers = new Set([
      ...property.units.map(u => u.unitNumber),
      ...units.map(u => u.unitNumber)
    ]);
    
    const newNumbers: string[] = [];
    for (let i = 0; i < quantity; i++) {
      newNumbers.push(String(startNum + i));
    }

    const duplicates = newNumbers.filter(num => existingNumbers.has(num));
    if (duplicates.length > 0) {
      alert(`Units ${duplicates.join(', ')} already exist. Please choose different numbers.`);
      return;
    }

    const newUnits: Omit<Unit, 'id'>[] = [];
    for (let i = 0; i < quantity; i++) {
      newUnits.push({
        unitNumber: String(startNum + i),
        type: unitConfig.type,
        squareFeet: parseInt(unitConfig.squareFeet) || 0,
        rentAmount: parseFloat(unitConfig.rentAmount) || 0,
        status: 'vacant',
      });
    }

    setUnits([...units, ...newUnits]);
    setUnitConfig({ startNumber: '', quantity: '', type: '', squareFeet: '', rentAmount: '' });
  };

  const handleRemoveUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const handleRemoveRange = (startIndex: number, count: number) => {
    setUnits(units.filter((_, i) => i < startIndex || i >= startIndex + count));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (units.length === 0) {
      alert('Please add at least one unit');
      return;
    }

    try {
      if (!property) {
        alert('Property not found');
        return;
      }

      // Create apartments
      await propertyService.addUnits(propertyId, units);

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error adding units:', error);
      alert('Could not add units');
    }
  };

  const handleClose = () => {
    setUnits([]);
    setUnitConfig({ startNumber: '', quantity: '', type: '', squareFeet: '', rentAmount: '' });
    onClose();
  };

  // Group units by configuration for preview
  const groupedUnits = (() => {
    const groups: { units: Omit<Unit, 'id'>[]; index: number }[] = [];
    let currentGroup: { units: Omit<Unit, 'id'>[]; index: number } | null = null;

    units.forEach((unit, idx) => {
      if (!currentGroup) {
        currentGroup = { units: [unit], index: idx };
      } else {
        const lastUnit = currentGroup.units[currentGroup.units.length - 1];
        const currentNum = parseInt(unit.unitNumber);
        const lastNum = parseInt(lastUnit.unitNumber);

        if (lastNum + 1 === currentNum && lastUnit.type === unit.type && lastUnit.rentAmount === unit.rentAmount) {
          currentGroup.units.push(unit);
        } else {
          groups.push(currentGroup);
          currentGroup = { units: [unit], index: idx };
        }
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  })();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-black">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            Add units
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Units Configuration */}
          <div className="space-y-4">
            <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
              Configure new units
            </h3>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[8px] p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Starting unit number *
                  </label>
                  <input
                    type="number"
                    value={unitConfig.startNumber}
                    onChange={(e) => setUnitConfig({ ...unitConfig, startNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="e.g. 201"
                  />
                </div>
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Number of units *
                  </label>
                  <input
                    type="number"
                    value={unitConfig.quantity}
                    onChange={(e) => setUnitConfig({ ...unitConfig, quantity: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Unit type *
                </label>
                <input
                  type="text"
                  value={unitConfig.type}
                  onChange={(e) => setUnitConfig({ ...unitConfig, type: e.target.value })}
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                  placeholder="e.g. 3 bedroom"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Size (m²)
                  </label>
                  <input
                    type="number"
                    value={unitConfig.squareFeet}
                    onChange={(e) => setUnitConfig({ ...unitConfig, squareFeet: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Monthly rent ($)
                  </label>
                  <input
                    type="number"
                    value={unitConfig.rentAmount}
                    onChange={(e) => setUnitConfig({ ...unitConfig, rentAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={generateUnits}
                className="w-full px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors text-sm"
              >
                + Add {unitConfig.quantity ? `${unitConfig.quantity} units` : 'units'}
              </button>
            </div>
          </div>

          {/* Units Preview */}
          {units.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
                Configured units ({units.length})
              </h3>

              <div className="space-y-2">
                {groupedUnits.map((group, groupIdx) => {
                  const isMultiple = group.units.length > 1;
                  const firstUnit = group.units[0];
                  const lastUnit = group.units[group.units.length - 1];

                  return (
                    <div
                      key={groupIdx}
                      className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px]"
                    >
                      <div className="flex-1 text-sm">
                        <p className="text-white font-semibold">
                          {isMultiple
                            ? `Units ${firstUnit.unitNumber} – ${lastUnit.unitNumber} (${group.units.length})`
                            : `Unit ${firstUnit.unitNumber}`}
                        </p>
                        <p className="text-[rgba(255,255,255,0.6)]">
                          {firstUnit.type} • {firstUnit.squareFeet}m² • ${firstUnit.rentAmount.toLocaleString()}/mo
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          isMultiple
                            ? handleRemoveRange(group.index, group.units.length)
                            : handleRemoveUnit(group.index)
                        }
                        className="text-[#ff6b6b] hover:text-[#ff5252] transition-colors ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
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
              disabled={units.length === 0}
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add units
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
