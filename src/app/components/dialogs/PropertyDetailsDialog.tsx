import type { Property } from '../../types/index';
import { X, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  property: Property | null;
  metrics?: {
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
  };
  onClose: () => void;
}

export function PropertyDetailsDialog({ isOpen, property, metrics, onClose }: PropertyDetailsDialogProps) {
  const navigate = useNavigate();
  
  if (!isOpen || !property) return null;

  const totalUnits = metrics?.totalUnits ?? property.totalUnits;
  const occupiedUnits = metrics?.occupiedUnits ?? property.occupiedUnits;
  const totalMonthlyRevenue = metrics?.monthlyRevenue ?? 0;

  const occupancyPercentage = totalUnits > 0
    ? Math.round((occupiedUnits / totalUnits) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Clicking outside closes dialog */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="dark:bg-[#0a0a0f] light:bg-white border border-[var(--glass-border)] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-10 flex flex-col">
        
        {/* Header Image Banner */}
        <div className="relative w-full h-[240px] shrink-0">
          <ImageWithFallback
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-deep)] via-[var(--background-deep)]/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary hover:text-primary bg-white/[0.1] hover:bg-white/[0.2] rounded-full backdrop-blur-md transition-all"
          >
            <X size={20} />
          </button>

          {/* Property Title & Address */}
          <div className="absolute bottom-6 left-8">
            <h2 className="font-['Chivo:Black',sans-serif] font-black text-[32px] text-primary tracking-tight mb-2">
              {property.name}
            </h2>
            <div className="flex items-center gap-2 text-secondary">
              <MapPin size={16} />
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px]">
                {property.address}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 pt-4 flex flex-col gap-8 overflow-y-auto">
          
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total Units Card */}
            <div className="glass-card p-5 rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-default">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[11px] tracking-wider uppercase text-tertiary mb-3">
                Total Units
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[28px] text-primary leading-none">
                {totalUnits}
              </p>
            </div>

            {/* Occupancy Card */}
            <div className="bg-[#928dd3]/[0.05] p-5 rounded-[16px] border border-[#928dd3]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#928dd3]/[0.08] hover:shadow-[0_8px_30px_rgba(146,141,211,0.1)] hover:border-[#928dd3]/50 cursor-default">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[11px] tracking-wider uppercase text-[#928dd3] mb-3">
                Occupancy
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[28px] text-[#928dd3] leading-none mb-1">
                {occupancyPercentage}%
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[#928dd3]/60">
                {occupiedUnits} of {totalUnits}
              </p>
            </div>

            {/* Revenue Card */}
            <div className="bg-[#0DC44A]/[0.05] p-5 rounded-[16px] border border-[#0DC44A]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0DC44A]/[0.08] hover:shadow-[0_8px_30px_rgba(13,196,74,0.1)] hover:border-[#0DC44A]/50 cursor-default">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[11px] tracking-wider uppercase text-[#0DC44A] mb-3">
                Revenue
              </p>
              <p className="font-['Chivo:Black',sans-serif] font-black text-[28px] text-[#0DC44A] leading-none">
                ${totalMonthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-transparent border border-[var(--glass-border)] hover:bg-white/[0.05] text-secondary font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                navigate(`/properties/${property.id}/apartments`);
              }}
              className="px-6 py-3 bg-[#928dd3] hover:bg-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] rounded-[12px] transition-colors flex items-center gap-2 group"
            >
              View apartments
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
