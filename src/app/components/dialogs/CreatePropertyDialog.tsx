import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import type { Unit } from '../../types/index';
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
  const { refreshProperties, currentOwner } = useOwner();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      const targetOwnerId = currentOwner?.id;
      if (!targetOwnerId) {
        throw new Error('No target owner found');
      }

      const createdProperty = await userService.createPropertyWithRanges({
        propertyName: formData.name,
        propertyAddress: formData.address,
        pictureUrl: formData.imageUrl,
        ownerId: targetOwnerId,
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

      // Wait until properties are refreshed so the list updates before closing
      await refreshProperties();
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Could not create property');
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="dark:bg-[#0a0a0f] light:bg-white border border-[var(--glass-border)] rounded-[24px] max-w-4xl w-full my-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-10">
        <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between sticky top-0 dark:bg-[#0a0a0f] light:bg-white z-10 rounded-t-[24px]">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-primary">
            Create property
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className={`p-2 text-secondary dark:bg-[#151520] light:bg-gray-100 rounded-full transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* General Property Information */}
          <div className="space-y-4">
            <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-primary text-lg border-l-4 border-[#928dd3] pl-3">
              General information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-secondary text-[14px] mb-2 uppercase tracking-wider">
                  Property name <span className="text-[#ff6b6b]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[12px] text-primary placeholder:text-tertiary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g. Sunset Apartments"
                />
              </div>

              <div>
                <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-secondary text-[14px] mb-2 uppercase tracking-wider">
                  Address <span className="text-[#ff6b6b]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[12px] text-primary placeholder:text-tertiary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g. 123 Main St, City, State"
                />
              </div>
            </div>

            <div>
              <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-secondary text-[14px] mb-2 uppercase tracking-wider">
                Cover image URL (optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-4 py-3 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[12px] text-primary placeholder:text-tertiary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Rules Configuration */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-l-4 border-[#928dd3] pl-3">
              <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-primary text-lg">
                Apartment generation rules
              </h3>
              <p className="text-sm text-tertiary">
                Range example: 1-5, 9, 11
              </p>
            </div>

            <div className="space-y-4">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="relative glass-card rounded-[16px] p-5 pt-6 transition-all hover:border-[#928dd3]/30">
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(rule.id)}
                      disabled={isSubmitting}
                      className={`absolute top-3 right-3 text-tertiary transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#ff6b6b]'}`}
                      title="Remove rule"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-secondary text-xs uppercase tracking-wider mb-2 font-semibold">
                        Floors (range) <span className="text-[#928dd3] ml-1">#</span>
                      </label>
                      <input
                        type="text"
                        value={rule.floorRanges}
                        onChange={(e) => updateRule(rule.id, 'floorRanges', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[8px] text-primary text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="e.g. 1-5, 9, 11"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-secondary text-xs uppercase tracking-wider mb-2 font-semibold">
                        Apartments (range) <span className="text-[#928dd3] ml-1">#</span>
                      </label>
                      <input
                        type="text"
                        value={rule.apartmentNumberRanges}
                        onChange={(e) => updateRule(rule.id, 'apartmentNumberRanges', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[8px] text-primary text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="e.g. 1-4, 8, 10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-secondary text-xs uppercase tracking-wider mb-2 font-semibold">
                        Square meters (m²)
                      </label>
                      <input
                        type="number"
                        value={rule.squareMeters}
                        onChange={(e) => updateRule(rule.id, 'squareMeters', e.target.value)}
                        min="1"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[8px] text-primary text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="e.g. 45"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-secondary text-xs uppercase tracking-wider mb-2 font-semibold">
                        Rent amount ($)
                      </label>
                      <input
                        type="number"
                        value={rule.rentValue}
                        onChange={(e) => updateRule(rule.id, 'rentValue', e.target.value)}
                        min="0"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[8px] text-primary text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[var(--glass-border)] text-secondary font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[16px] transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#928dd3] hover:text-[#928dd3] hover:bg-[#928dd3]/5'}`}
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
            <div className="bg-[#928dd3]/10 border border-[#928dd3]/30 rounded-[12px] p-4 text-[#928dd3] text-sm">
              <strong>OK: </strong>
              This will create <strong>{parsedRanges.length}</strong> valid apartment range block(s).
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[var(--glass-border)] mt-8 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={`px-6 py-3 bg-transparent border border-[var(--glass-border)] text-secondary font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/[0.05]'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!formError || parsedRanges.length === 0}
              className={`px-6 py-3 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-all duration-300 ${isSubmitting || !!formError || parsedRanges.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] active:scale-95'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-transparent border-t-black rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
