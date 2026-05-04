import { useState, useEffect } from 'react';
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

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-black">
          <div>
            <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
              {tenant.name}
            </h2>
            <p className="text-[rgba(255,255,255,0.6)] text-sm mt-1">
              {tenant.email && tenant.email}
            </p>
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              {tenant.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-[rgba(255,255,255,0.6)]">
              Loading apartments...
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-center text-[rgba(255,255,255,0.6)] py-8">
              No apartments assigned to this tenant
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
                  Assigned Apartments ({apartments.length})
                </h3>
                <button
                  onClick={handleUnlinkAllProperties}
                  className="rounded-[8px] border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 px-3 py-2 text-sm font-semibold text-[#ff6b6b] transition-colors hover:bg-[#ff6b6b]/20 hover:text-white"
                >
                  Unlink from all apartments
                </button>
              </div>
              {apartments.map((apt, idx) => (
                <div
                  key={idx}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[8px] p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
                        {apt.propertyName}
                      </p>
                      <p className="text-[rgba(255,255,255,0.6)] text-sm">
                        Apt. {apt.apartmentNumber} • Floor {apt.floor}
                      </p>
                    </div>
                    <StatusBadge status={apt.paymentStatus.toLowerCase() as any} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[rgba(255,255,255,0.6)]">Monthly Rent</p>
                      <p className="text-white font-semibold">${apt.rent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[rgba(255,255,255,0.6)]">Due Date</p>
                      <p className="text-white font-semibold">{apt.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 border-t border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-white/15 text-white rounded-xl hover:bg-white/5 transition-colors text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
