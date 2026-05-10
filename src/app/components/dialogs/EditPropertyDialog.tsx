import { useState } from 'react';
import { X } from 'lucide-react';
import type { Property } from '../../types/index';
import userService from '../../../services/userService';

interface EditPropertyDialogProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export function EditPropertyDialog({ isOpen, property, onClose, onSuccess }: EditPropertyDialogProps) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.address || '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormFromProperty = () => {
    setFormData({
      name: property?.name || '',
      address: property?.address || '',
    });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !property) {
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.updateProperty(property.id, {
        propertyName: formData.name,
        propertyAddress: formData.address,
      });

      await onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetFormFromProperty();
    onClose();
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="bg-[#0a0a0f] border border-white/10 rounded-[24px] max-w-2xl w-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative z-10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-white">
            Edit Property
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-white/70 text-[14px] mb-2 uppercase tracking-wider">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: '' });
                }
              }}
              className={`w-full px-4 py-3 bg-white/[0.03] border rounded-[12px] text-white placeholder-white/30 transition-all duration-300 outline-none ${validationErrors.name
                  ? 'border-[#ff6b6b] focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]'
                  : 'border-white/10 focus:border-[#928dd3] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#928dd3]'
                }`}
              placeholder="Property Name"
            />
            {validationErrors.name && (
              <p className="text-[#ff6b6b] text-xs mt-2 font-medium">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-white/70 text-[14px] mb-2 uppercase tracking-wider">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (validationErrors.address) {
                  setValidationErrors({ ...validationErrors, address: '' });
                }
              }}
              className={`w-full px-4 py-3 bg-white/[0.03] border rounded-[12px] text-white placeholder-white/30 transition-all duration-300 outline-none ${validationErrors.address
                  ? 'border-[#ff6b6b] focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]'
                  : 'border-white/10 focus:border-[#928dd3] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#928dd3]'
                }`}
              placeholder="Property Address"
            />
            {validationErrors.address && (
              <p className="text-[#ff6b6b] text-xs mt-2 font-medium">{validationErrors.address}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#928dd3] to-[#a89be6] hover:opacity-100 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
