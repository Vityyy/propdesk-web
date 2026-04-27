import type { Property } from '../../types/index';

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
}

export function PropertyDetailsDialog({ isOpen, property, onClose }: PropertyDetailsDialogProps) {
  if (!isOpen || !property) return null;

  const occupiedUnits = property.units.filter(u => u.status === 'occupied');

  const occupancyPercentage = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;

  const totalMonthlyRevenue = occupiedUnits.reduce((sum, u) => sum + u.rentAmount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-[#111] z-10">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-[20px] text-white">
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
              Address
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px] text-white">
              {property.address}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Total Units
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-white">
                {property.totalUnits}
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Occupancy
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-[#928dd3]">
                {occupancyPercentage}%
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.5)]">
                {property.occupiedUnits} of {property.totalUnits}
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-[8px] border border-[rgba(255,255,255,0.16)]">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] text-[rgba(255,255,255,0.6)] mb-2">
                Monthly Revenue
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[24px] text-[#4ade80]">
                ${totalMonthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#928dd3] text-black font-bold rounded-[8px] hover:bg-[#a89be6] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
