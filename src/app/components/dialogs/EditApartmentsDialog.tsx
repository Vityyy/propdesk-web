import { useState, useEffect } from 'react';
import userService, { ApartmentGridResponse } from '../../../services/userService';

interface EditApartmentsDialogProps {
  isOpen: boolean;
  apartments: ApartmentGridResponse[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditApartmentsDialog({ isOpen, apartments, onClose, onSuccess }: EditApartmentsDialogProps) {
  const [formData, setFormData] = useState({
    rent: '',
    squareMeters: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBulk = apartments.length > 1;

  useEffect(() => {
    if (isOpen && apartments.length === 1) {
      setFormData({
        rent: apartments[0].rent?.toString() || '',
        squareMeters: apartments[0].squareMeters?.toString() || '',
      });
    } else if (isOpen && apartments.length > 1) {
      setFormData({ rent: '', squareMeters: '' });
    }
    setError(null);
  }, [isOpen, apartments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apartments.length === 0) return;

    const updates: { rent?: number; squareMeters?: number } = {};
    
    if (formData.rent.trim() !== '') {
      const parsedRent = parseFloat(formData.rent);
      if (isNaN(parsedRent) || parsedRent < 0) {
        setError('Rent value must be a valid number greater than 0');
        return;
      }
      updates.rent = parsedRent;
    }

    if (formData.squareMeters.trim() !== '') {
      const parsedSqM = parseFloat(formData.squareMeters);
      if (isNaN(parsedSqM) || parsedSqM <= 0) {
        setError('Area must be a valid number greater than 0');
        return;
      }
      updates.squareMeters = parsedSqM;
    }

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isBulk) {
        await userService.bulkUpdateApartments({
          apartmentIds: apartments.map(a => a.id),
          ...updates,
        });
      } else {
        await userService.updateApartment(apartments[0].id, updates);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error updating apartments', err);
      setError(err.message || 'An error occurred while trying to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h2 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-white">
              {isBulk ? 'Bulk Edit' : 'Edit Apartment'}
            </h2>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
              {isBulk 
                ? `Editing ${apartments.length} selected apartments` 
                : `Editing data for apartment`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {isBulk && (
            <div className="p-3 bg-[#928dd3]/10 border border-[#928dd3]/30 rounded-lg text-[#928dd3] text-sm">
              <p>Note: Only the fields you fill in will be updated in all selected apartments. Leave blank to keep unchanged.</p>
            </div>
          )}

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2">
              Rent Value ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-[rgba(255,255,255,0.1)] focus:border-[#928dd3] rounded-xl text-white placeholder-[rgba(255,255,255,0.3)] transition-colors focus:outline-none"
              placeholder={isBulk ? 'Leave blank to keep unchanged' : 'e.g., 1500.00'}
            />
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2">
              Area (m²)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.squareMeters}
              onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-[rgba(255,255,255,0.1)] focus:border-[#928dd3] rounded-xl text-white placeholder-[rgba(255,255,255,0.3)] transition-colors focus:outline-none"
              placeholder={isBulk ? 'Leave blank to keep unchanged' : 'e.g., 45.5'}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-[rgba(255,255,255,0.1)] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-[rgba(255,255,255,0.1)] text-white rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#928dd3] text-black font-bold rounded-xl hover:bg-[#a89be6] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
