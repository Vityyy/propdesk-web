import { useState, useMemo } from 'react';
import type { Unit } from '../../types/index';
import { propertyService } from '../../../services/propertyService';
import authService from '../../../services/authService';
import userService, { ApartmentRangeData } from '../../../services/userService';
import { useOwner } from '../../context/OwnerContext';
import { parseRange, generateApartmentRanges, findOverlapError } from '../../../utils/rangeParser';

interface CreatePropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Rule {
  id: string;
  floorRanges: string;
  apartmentNumberRanges: string;
  squareMeters: string;
  rentValue: string;
}

export function CreatePropertyDialog({ isOpen, onClose, onSuccess }: CreatePropertyDialogProps) {
  const { refreshProperties } = useOwner();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    imageUrl: '',
  });

  const [rules, setRules] = useState<Rule[]>([
    {
      id: crypto.randomUUID(),
      floorRanges: '',
      apartmentNumberRanges: '',
      squareMeters: '',
      rentValue: '',
    }
  ]);

  const { parsedRanges, formError } = useMemo(() => {
    try {
      let allRanges: ApartmentRangeData[] = [];

      // We only parse if there are some inputs
      for (const rule of rules) {
        if (!rule.floorRanges || !rule.apartmentNumberRanges || !rule.squareMeters || !rule.rentValue) {
          continue; // Skip incomplete rules in preview
        }

        const fIntervals = parseRange(rule.floorRanges);
        const aIntervals = parseRange(rule.apartmentNumberRanges);
        const sqMt = parseFloat(rule.squareMeters) || 0;
        const rent = parseFloat(rule.rentValue) || 0;

        const generated = generateApartmentRanges(fIntervals, aIntervals, sqMt, rent);
        allRanges = [...allRanges, ...generated];
      }

      // Check overlaps globally
      const overlapErr = findOverlapError(allRanges);
      if (overlapErr) {
        return { parsedRanges: allRanges, formError: overlapErr };
      }

      return { parsedRanges: allRanges, formError: null };
    } catch (err: any) {
      return { parsedRanges: [], formError: err.message || 'Error parsing ranges.' };
    }
  }, [rules]);

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: crypto.randomUUID(),
        floorRanges: '',
        apartmentNumberRanges: '',
        squareMeters: '',
        rentValue: '',
      }
    ]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Property name and address cannot be empty.');
      return;
    }

    if (rules.some(r => !r.floorRanges || !r.apartmentNumberRanges || !r.squareMeters || !r.rentValue)) {
      alert('Please complete every field in all apartment rules before submitting.');
      return;
    }

    if (formError) {
      alert('Fix the errors in the apartment rules before creating the property.');
      return;
    }

    if (parsedRanges.length === 0) {
      alert('At least one apartment must be generated from the rules.');
      return;
    }

    try {
      const authenticatedOwnerId = authService.getCurrentUserId();
      if (!authenticatedOwnerId) {
        throw new Error('No authenticated owner found');
      }

      const createdProperty = await userService.createPropertyWithRanges({
        propertyName: formData.name,
        propertyAddress: formData.address,
        pictureUrl: formData.imageUrl,
        ownerId: authenticatedOwnerId,
        apartmentRanges: parsedRanges,
      });

      // Backward compatible mapping for localStorage (since local storage expects units)
      const mappedUnits: Unit[] = parsedRanges.map((r, i) => {
        // Floor 1, Apt 4 => Unit '104'. Just pad apartments with 2 zeros.
        const unitNumber = `${r.startFloor}${String(r.startApartmentNumber).padStart(2, '0')}`;
        return {
          id: `local-unit-${i}-${crypto.randomUUID()}`,
          unitNumber,
          type: 'Apartment',
          squareFeet: r.squareMeters,
          rentAmount: r.rentValue,
          status: 'vacant' as const,
        };
      });

      propertyService.storeProperty({
        id: createdProperty.id || crypto.randomUUID(),
        ownerId: authenticatedOwnerId,
        name: formData.name,
        address: formData.address,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x300?text=Property',
        description: '',
        units: mappedUnits,
        totalUnits: mappedUnits.length,
        occupiedUnits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      refreshProperties();
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Could not create property');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', address: '', imageUrl: '' });
    setRules([{
      id: crypto.randomUUID(),
      floorRanges: '',
      apartmentNumberRanges: '',
      squareMeters: '',
      rentValue: '',
    }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-4xl w-full my-8">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-[#0f0f0f] z-10 rounded-t-[16px]">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[22px] text-white">
            Create property
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* General Property Information */}
          <div className="space-y-4">
            <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white/90 text-lg border-l-4 border-[#928dd3] pl-3">
              General information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Property name <span className="text-[#ff6b6b]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.16)] focus:border-[#928dd3] outline-none rounded-[8px] text-white placeholder-[rgba(255,255,255,0.3)] transition-all"
                  placeholder="e.g. Sunset Apartments"
                />
              </div>

              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Address <span className="text-[#ff6b6b]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.16)] focus:border-[#928dd3] outline-none rounded-[8px] text-white placeholder-[rgba(255,255,255,0.3)] transition-all"
                  placeholder="e.g. 123 Main St, City, State"
                />
              </div>
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Cover image URL (optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.16)] focus:border-[#928dd3] outline-none rounded-[8px] text-white placeholder-[rgba(255,255,255,0.3)] transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Rules Configuration */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-l-4 border-[#928dd3] pl-3">
              <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white/90 text-lg">
                Apartment generation rules
              </h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">
                Range example: 1-5, 9, 11
              </p>
            </div>

            <div className="space-y-4">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-5 pt-6 transition-all hover:border-[rgba(255,255,255,0.2)]">
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(rule.id)}
                      className="absolute top-3 right-3 text-[rgba(255,255,255,0.4)] hover:text-[#ff6b6b] transition-colors"
                      title="Remove rule"
                    >
                      ✕
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[rgba(255,255,255,0.7)] text-xs uppercase tracking-wider mb-2 font-semibold">
                        Floors (range) <span className="text-[#928dd3] ml-1">#</span>
                      </label>
                      <input
                        type="text"
                        value={rule.floorRanges}
                        onChange={(e) => updateRule(rule.id, 'floorRanges', e.target.value)}
                        className="w-full px-3 py-2 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] focus:border-[#928dd3] outline-none rounded-[6px] text-white text-sm"
                        placeholder="e.g. 1-5, 9, 11"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[rgba(255,255,255,0.7)] text-xs uppercase tracking-wider mb-2 font-semibold">
                        Apartments (range) <span className="text-[#928dd3] ml-1">#</span>
                      </label>
                      <input
                        type="text"
                        value={rule.apartmentNumberRanges}
                        onChange={(e) => updateRule(rule.id, 'apartmentNumberRanges', e.target.value)}
                        className="w-full px-3 py-2 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] focus:border-[#928dd3] outline-none rounded-[6px] text-white text-sm"
                        placeholder="e.g. 1-4, 8, 10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[rgba(255,255,255,0.7)] text-xs uppercase tracking-wider mb-2 font-semibold">
                        Square meters (m²)
                      </label>
                      <input
                        type="number"
                        value={rule.squareMeters}
                        onChange={(e) => updateRule(rule.id, 'squareMeters', e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] focus:border-[#928dd3] outline-none rounded-[6px] text-white text-sm"
                        placeholder="e.g. 45"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[rgba(255,255,255,0.7)] text-xs uppercase tracking-wider mb-2 font-semibold">
                        Rent amount ($)
                      </label>
                      <input
                        type="number"
                        value={rule.rentValue}
                        onChange={(e) => updateRule(rule.id, 'rentValue', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] focus:border-[#928dd3] outline-none rounded-[6px] text-white text-sm"
                        placeholder="e.g. 1500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRule}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[rgba(255,255,255,0.3)] text-[rgba(255,255,255,0.7)] font-medium rounded-[12px] hover:border-[#928dd3] hover:text-[#928dd3] hover:bg-[rgba(146,141,211,0.05)] transition-all"
            >
              <span>+</span> Add rule
            </button>
          </div>

          {/* Validation & Preview Panel */}
          {formError && (
            <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-[12px] p-4 text-[#ff6b6b] text-sm animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <strong>Warning: </strong>
              {formError}
            </div>
          )}

          {!formError && parsedRanges.length > 0 && (
            <div className="bg-[rgba(146,141,211,0.1)] border border-[#928dd3]/30 rounded-[12px] p-4 text-[#a89be6] text-sm">
              <strong>OK: </strong>
              This will create <strong>{parsedRanges.length}</strong> valid apartment range block(s).
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-[rgba(255,255,255,0.16)]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-[rgba(255,255,255,0.16)] text-white font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!formError || parsedRanges.length === 0}
              className="flex-1 px-6 py-3 bg-[#928dd3] text-black font-bold rounded-[12px] hover:bg-[#a89be6] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(146,141,211,0.4)]"
            >
              Create property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
