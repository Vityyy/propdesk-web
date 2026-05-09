import { useState } from 'react';
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-[20px] text-white">
            Edit Property
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
              className={`w-full px-4 py-2 bg-black border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                validationErrors.name ? 'border-[#ff6b6b]' : 'border-[rgba(255,255,255,0.16)] focus:border-[#928dd3]'
              }`}
              placeholder="Property Name"
            />
            {validationErrors.name && (
              <p className="text-[#ff6b6b] text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
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
              className={`w-full px-4 py-2 bg-black border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                validationErrors.address ? 'border-[#ff6b6b]' : 'border-[rgba(255,255,255,0.16)] focus:border-[#928dd3]'
              }`}
              placeholder="Property Address"
            />
            {validationErrors.address && (
              <p className="text-[#ff6b6b] text-xs mt-1">{validationErrors.address}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
