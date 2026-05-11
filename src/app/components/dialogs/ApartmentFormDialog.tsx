import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface ApartmentFormDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  initialRent?: string;
  initialSquareMeters?: string;
  isBulk?: boolean;
  isAddMode?: boolean;
  onClose: () => void;
  onSubmit: (data: { rent: string; squareMeters: string }) => Promise<void>;
  submitText: string;
  submittingText: string;
}

export function ApartmentFormDialog({
  isOpen,
  title,
  description,
  initialRent = '',
  initialSquareMeters = '',
  isBulk = false,
  isAddMode = false,
  onClose,
  onSubmit,
  submitText,
  submittingText,
}: ApartmentFormDialogProps) {
  const [formData, setFormData] = useState({ rent: '', squareMeters: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ rent: initialRent, squareMeters: initialSquareMeters });
      setError(null);
    }
  }, [isOpen, initialRent, initialSquareMeters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isAddMode && (!formData.rent || !formData.squareMeters)) {
      setError('Both rent and area are required');
      return;
    }

    if (formData.rent.trim() !== '') {
      const parsedRent = parseFloat(formData.rent);
      if (isNaN(parsedRent) || parsedRent < 0) {
        setError('Rent value must be a valid number greater than 0');
        return;
      }
    }

    if (formData.squareMeters.trim() !== '') {
      const parsedSqM = parseFloat(formData.squareMeters);
      if (isNaN(parsedSqM) || parsedSqM <= 0) {
        setError('Area must be a valid number greater than 0');
        return;
      }
    }

    if (!isAddMode && formData.rent.trim() === '' && formData.squareMeters.trim() === '') {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      console.error('Error in form submission', err);
      setError(err.message || 'An error occurred during the operation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[var(--bg-deep)] border border-[var(--glass-border)] rounded-[24px] max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative z-10">
        <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between">
          <div>
            <h2 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-[var(--text-primary)]">
              {title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded-full transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--glass-border)] shadow-sm"
          >
            <X size={20} />
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
            <label className="block text-[var(--text-secondary)] text-sm font-semibold mb-2">
              Rent Value ($) {isAddMode && '*'}
            </label>
            <input
              type="number"
              step="0.01"
              required={isAddMode}
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] focus:border-[#928dd3] focus:bg-[var(--bg-subtle)] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[12px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all duration-300"
              placeholder={isBulk ? 'Leave blank to keep unchanged' : 'e.g., 1500.00'}
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] text-sm font-semibold mb-2">
              Area (m²) {isAddMode && '*'}
            </label>
            <input
              type="number"
              step="0.01"
              required={isAddMode}
              value={formData.squareMeters}
              onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] focus:border-[#928dd3] focus:bg-[var(--bg-subtle)] focus:ring-1 focus:ring-[#928dd3] outline-none rounded-[12px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all duration-300"
              placeholder={isBulk ? 'Leave blank to keep unchanged' : 'e.g., 45.5'}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-[var(--glass-border)] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 bg-transparent border border-[var(--glass-border)] text-[var(--text-primary)] font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-subtle)]'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] active:scale-95'}`}
            >
              {isSubmitting ? submittingText : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
