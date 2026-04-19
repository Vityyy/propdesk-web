import { useState } from 'react';
import type { Property } from '../../types/index';
import { AddApartmentDialog } from './AddApartmentDialog';

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PropertyDetailsDialog({ isOpen, property, onClose, onSuccess }: PropertyDetailsDialogProps) {
  const [showAddApartmentDialog, setShowAddApartmentDialog] = useState(false);

  const handleAddApartmentSuccess = () => {
    setShowAddApartmentDialog(false);
    onSuccess?.();
  };
  if (!isOpen || !property) return null;

  const occupiedUnits = property.units.filter(u => u.status === 'occupied');
  const vacantUnits = property.units.filter(u => u.status === 'vacant');
  const maintenanceUnits = property.units.filter(u => u.status === 'maintenance');

  const occupancyPercentage = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;

  const totalMonthlyRevenue = occupiedUnits.reduce((sum, u) => sum + u.rentAmount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-black">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            {property.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Info */}
          <div>
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] text-[rgba(255,255,255,0.6)] mb-2">
              Dirección
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px] text-white">
              {property.address}
            </p>
          </div>

          {property.description && (
            <div>
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] text-[rgba(255,255,255,0.6)] mb-2">
                Descripción
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px] text-white">
                {property.description}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Total de Unidades
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-white">
                {property.totalUnits}
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Ocupación
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-[#928dd3]">
                {occupancyPercentage}%
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.5)]">
                {property.occupiedUnits} de {property.totalUnits}
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Ingreso Mensual
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-[#0DC44A]">
                ${totalMonthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Occupied Units */}
          {occupiedUnits.length > 0 && (
            <div>
              <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[15px] text-white mb-3">
                Unidades Ocupadas ({occupiedUnits.length})
              </p>
              <div className="space-y-2">
                {occupiedUnits.map((unit) => (
                  <div key={unit.id} className="bg-[rgba(13,196,74,0.1)] border border-[rgba(13,196,74,0.3)] p-3 rounded-[8px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] text-white">
                          Unidad {unit.unitNumber}
                        </p>
                        <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.6)]">
                          {unit.type} • {unit.squareFeet} sq ft
                        </p>
                      </div>
                      <p className="font-['Chivo:Black',sans-serif] font-black text-[16px] text-[#0DC44A]">
                        ${unit.rentAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vacant Units */}
          {vacantUnits.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[15px] text-white">
                  Unidades Vacantes ({vacantUnits.length})
                </p>
                <button
                  onClick={() => setShowAddApartmentDialog(true)}
                  className="px-3 py-1 bg-[#928dd3] text-black font-semibold rounded-[6px] hover:bg-[#a89be6] transition-colors text-sm"
                >
                  + Agregar Unidades
                </button>
              </div>
              <div className="space-y-2">
                {vacantUnits.map((unit) => (
                  <div key={unit.id} className="bg-[rgba(147,141,211,0.1)] border border-[rgba(147,141,211,0.3)] p-3 rounded-[8px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] text-white">
                          Unidad {unit.unitNumber}
                        </p>
                        <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.6)]">
                          {unit.type} • {unit.squareFeet} sq ft
                        </p>
                      </div>
                      <p className="font-['Chivo:Black',sans-serif] font-black text-[16px] text-[#928dd3]">
                        ${unit.rentAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Units */}
          {maintenanceUnits.length > 0 && (
            <div>
              <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[15px] text-white mb-3">
                Unidades en Mantenimiento ({maintenanceUnits.length})
              </p>
              <div className="space-y-2">
                {maintenanceUnits.map((unit) => (
                  <div key={unit.id} className="bg-[rgba(255,165,0,0.1)] border border-[rgba(255,165,0,0.3)] p-3 rounded-[8px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] text-white">
                          Unidad {unit.unitNumber}
                        </p>
                        <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.6)]">
                          {unit.type} • {unit.squareFeet} sq ft
                        </p>
                      </div>
                      <p className="font-['Chivo:Black',sans-serif] font-black text-[16px] text-[#FFA500]">
                        ${unit.rentAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {property && (
        <AddApartmentDialog
          isOpen={showAddApartmentDialog}
          propertyId={property.id}
          onClose={() => setShowAddApartmentDialog(false)}
          onSuccess={handleAddApartmentSuccess}
        />
      )}
    </div>
  );
}
