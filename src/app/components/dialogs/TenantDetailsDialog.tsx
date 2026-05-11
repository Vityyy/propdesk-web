import { useState, useEffect } from 'react';
import { X, Mail, Phone, Unlink } from 'lucide-react';
import type { Tenant } from '../../types/index';
import { useOwner } from '../../context/OwnerContext';
import userService from '../../../services/userService';
import { tenantService } from '../../../services/tenantService';
import { StatusBadge } from '../StatusBadge';

interface TenantDetailsDialogProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
}

interface ApartmentDetail {
  propertyName: string;
  apartmentNumber: number;
  floor: number;
  rent: number;
  dueDate: string;
  paymentStatus: string;
}

export function TenantDetailsDialog({ isOpen, tenant, onClose }: TenantDetailsDialogProps) {
  const { properties, currentOwner, refreshTenants, refreshProperties } = useOwner();
  const [apartments, setApartments] = useState<ApartmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tenant) {
      fetchTenantApartments();
    }
  }, [isOpen, tenant]);

  const fetchTenantApartments = async () => {
    if (!tenant) return;

    setIsLoading(true);
    try {
      const apartmentsList: ApartmentDetail[] = [];

      for (const property of properties) {
        try {
          const gridData = await userService.getPropertyApartmentsGrid(property.id);
          Object.entries(gridData).forEach(([floor, floorApts]) => {
            Object.entries(floorApts).forEach(([apartmentNumberKey, apt]: [any, any]) => {
              if (apt.tenant?.id === tenant.id) {
                apartmentsList.push({
                  propertyName: property.name,
                  apartmentNumber: Number(apartmentNumberKey) || apt.number,
                  floor: parseInt(floor),
                  rent: apt.rent || 0,
                  dueDate: apt.dueDate || '-',
                  paymentStatus: apt.paymentStatus || 'UNKNOWN',
                });
              }
            });
          });
        } catch (error) {
          console.error(`Error fetching apartments for property ${property.id}`, error);
        }
      }

      setApartments(apartmentsList);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkAllProperties = async () => {
    if (!tenant) return;

    const confirmed = window.confirm(
      'Do you want to remove the tenant from all apartments?\nThis action cannot be undone.'
    );

    if (!confirmed) return;

    onClose();

    try {
      await tenantService.deleteTenant(tenant.id, currentOwner.id);
      await refreshTenants();
      await refreshProperties();
    } catch (error) {
      console.error('Error deleting tenant and unlinking properties:', error);
      window.alert('No se pudieron desvincular todas las propiedades del inquilino.');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getBadgeStyles = (status: string) => {
    if (status === 'PAID') {
      return { color: '#4ade80', text: 'Paid', bg: 'bg-[#4ade80]/15', border: 'border-[#4ade80]/40' };
    } else if (status === 'PENDING') {
      return { color: '#f59e0b', text: 'Pending', bg: 'bg-[#f59e0b]/15', border: 'border-[#f59e0b]/40' };
    }
    return { color: '#928dd3', text: 'Unknown', bg: 'bg-[#928dd3]/15', border: 'border-[#928dd3]/40' };
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="dark:bg-[#0a0a0f] light:bg-white border border-[var(--glass-border)] rounded-[16px] max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative z-10">
        <div className="p-6 pb-5 border-b border-[var(--glass-border)] flex items-start justify-between sticky top-0 dark:bg-[#0a0a0f] light:bg-white z-10">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-[#928dd3]/20 text-[#928dd3] flex items-center justify-center text-lg font-bold font-['Chivo:Black',sans-serif] shrink-0">
              {getInitials(tenant.name)}
            </div>
            <div>
              <h2 className="font-['Chivo:Black',sans-serif] font-black text-lg text-[var(--text-primary)] mb-1">
                {tenant.name}
              </h2>
              {tenant.email && (
                <div className="flex items-center text-[var(--text-secondary)] hover:text-[#928dd3] transition-colors cursor-pointer text-xs mb-1 gap-2 font-['Archivo:Medium',sans-serif]">
                  <Mail size={12} />
                  <span>{tenant.email}</span>
                </div>
              )}
              {tenant.phone && (
                <div className="flex items-center text-[var(--text-secondary)] hover:text-[#928dd3] transition-colors cursor-pointer text-xs gap-2 font-['Archivo:Medium',sans-serif]">
                  <Phone size={12} />
                  <span>{tenant.phone}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] dark:bg-[#151520] light:bg-gray-100 rounded-full transition-colors hover:text-[var(--text-primary)] light:hover:bg-gray-200 dark:hover:bg-[#252530] shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-[var(--text-secondary)]">
              Loading apartments...
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-center text-[var(--text-secondary)] py-8">
              No apartments assigned to this tenant
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[var(--text-primary)] text-sm">
                  Assigned Apartments ({apartments.length})
                </h3>
                <button
                  onClick={handleUnlinkAllProperties}
                  className="rounded-[8px] border border-[#ff6b6b]/50 bg-transparent px-3 py-1.5 text-xs font-semibold text-[#ff6b6b] transition-colors hover:bg-[#ff6b6b]/10 flex items-center gap-1.5"
                >
                  <Unlink size={12} />
                  Unlink from all
                </button>
              </div>
              {apartments.map((apt, idx) => (
                <div
                  key={idx}
                  className="dark:bg-[#151520] light:bg-gray-50 border border-[var(--glass-border)] rounded-[16px] p-4 hover:border-[var(--glass-border-hover)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[var(--text-primary)]">
                        {apt.propertyName}
                      </p>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Apt. {apt.apartmentNumber} • Floor {apt.floor}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyles(apt.paymentStatus).bg} ${getBadgeStyles(apt.paymentStatus).border}`} style={{ color: getBadgeStyles(apt.paymentStatus).color }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getBadgeStyles(apt.paymentStatus).color }} />
                      {getBadgeStyles(apt.paymentStatus).text}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--text-secondary)]">Monthly Rent</p>
                      <p className="text-[var(--text-primary)] font-semibold">${apt.rent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-secondary)]">Due Date</p>
                      <p className="text-[var(--text-primary)] font-semibold">{apt.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[var(--bg-subtle)] border border-[var(--glass-border)] text-[var(--text-primary)] font-['Archivo:SemiBold',sans-serif] font-semibold text-sm rounded-[8px] transition-colors hover:bg-[var(--glass-border)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
