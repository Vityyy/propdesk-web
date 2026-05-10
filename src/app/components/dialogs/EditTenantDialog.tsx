import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-[24px] max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-white">Edit Tenant</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-white/60 bg-white/5 rounded-full transition-colors hover:text-white hover:bg-white/10 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-white/[0.03] border rounded-[12px] text-white placeholder-white/30 focus:outline-none transition-all duration-300 hover:border-white/20 ${
                validationErrors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/10 focus:border-[#928dd3] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.name && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 bg-white/[0.03] border rounded-[12px] text-white placeholder-white/30 focus:outline-none transition-all duration-300 hover:border-white/20 ${
                validationErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/10 focus:border-[#928dd3] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm font-semibold mb-2 uppercase tracking-wider">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 bg-white/[0.03] border rounded-[12px] text-white placeholder-white/30 focus:outline-none transition-all duration-300 hover:border-white/20 ${
                validationErrors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/10 focus:border-[#928dd3] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#928dd3]'
              }`}
              disabled={loading}
            />
            {validationErrors.phone && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-transparent border border-white/10 text-white font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors hover:bg-white/5 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-all duration-300 disabled:opacity-50 hover:opacity-100 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] active:scale-95"
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
