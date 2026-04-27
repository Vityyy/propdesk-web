import { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h2 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-white">
              {title}
            </h2>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
              {description}
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
              Rent Value ($) {isAddMode && '*'}
            </label>
            <input
              type="number"
              step="0.01"
              required={isAddMode}
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              className={`w-full px-4 py-3 bg-black border border-[rgba(255,255,255,0.1)] focus:border-[${isAddMode ? '#4ade80' : '#928dd3'}] rounded-xl text-white placeholder-[rgba(255,255,255,0.3)] transition-colors focus:outline-none`}
              placeholder={isBulk ? 'Leave blank to keep unchanged' : 'e.g., 1500.00'}
            />
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2">
              Area (m²) {isAddMode && '*'}
            </label>
            <input
              type="number"
              step="0.01"
              required={isAddMode}
              value={formData.squareMeters}
              onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
              className={`w-full px-4 py-3 bg-black border border-[rgba(255,255,255,0.1)] focus:border-[${isAddMode ? '#4ade80' : '#928dd3'}] rounded-xl text-white placeholder-[rgba(255,255,255,0.3)] transition-colors focus:outline-none`}
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
              className={`flex-1 px-4 py-3 text-black font-bold rounded-xl transition-colors disabled:opacity-50 ${isAddMode ? 'bg-[#4ade80] hover:bg-[#22c55e]' : 'bg-[#928dd3] hover:bg-[#a89be6]'}`}
            >
              {isSubmitting ? submittingText : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
