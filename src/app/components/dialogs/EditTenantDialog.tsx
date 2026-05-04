import { useState, useEffect } from 'react';
import type { Tenant } from '../../types/index';
import { useOwner } from '../../context/OwnerContext';
import userService from '../../../services/userService';
import { validation } from '../../../utils/validation';

interface EditTenantDialogProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditTenantDialog({ isOpen, tenant, onClose, onSuccess }: EditTenantDialogProps) {
  const { refreshTenants, refreshProperties, properties } = useOwner();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: '',
    email: '',
    phone: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tenant && isOpen) {
      setFormData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
      });
      setValidationErrors({});
    }
  }, [tenant, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (formData.email?.trim() && !validation.validateEmail(formData.email)) {
      errors.email = 'Enter a valid email (must include @ and a domain)';
    }
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone is required';
    } else if (!validation.validatePhone(formData.phone)) {
      errors.phone = 'Phone may only contain digits, +, spaces, hyphens, and parentheses';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const findApartmentIdWithTenant = async (): Promise<string | null> => {
    if (!tenant) return null;

    for (const property of properties) {
      try {
        const gridData = await userService.getPropertyApartmentsGrid(property.id);
        for (const floorApts of Object.values(gridData)) {
          for (const apt of Object.values(floorApts)) {
            if (apt.tenant?.id === tenant.id) {
              return apt.id;
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for tenant in property ${property.id}`, error);
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !tenant) {
      return;
    }

    setLoading(true);
    try {
      const apartmentId = await findApartmentIdWithTenant();

      if (!apartmentId) {
        alert('Tenant not assigned to any apartment. Cannot update.');
        setLoading(false);
        return;
      }

      await userService.updateTenant(apartmentId, {
        name: formData.name,
        email: formData.email || '',
        phone: formData.phone || '',
      });

      // Wait for both refresh calls to complete before closing
      await Promise.all([refreshTenants(), refreshProperties()]);
      
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      alert(error?.message || 'Could not update tenant');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
    setValidationErrors({});
    onClose();
  };

  if (!isOpen || !tenant) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.2)] rounded-lg p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Tenant</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 bg-[#111] border rounded-lg text-white placeholder-white/30 focus:outline-none transition-colors ${
                validationErrors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(255,255,255,0.2)] focus:border-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.name && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 bg-[#111] border rounded-lg text-white placeholder-white/30 focus:outline-none transition-colors ${
                validationErrors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(255,255,255,0.2)] focus:border-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-3 py-2 bg-[#111] border rounded-lg text-white placeholder-white/30 focus:outline-none transition-colors ${
                validationErrors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[rgba(255,255,255,0.2)] focus:border-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.phone && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors font-semibold disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black hover:bg-[#a89be6] rounded-lg transition-colors font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
