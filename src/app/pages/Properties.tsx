import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useOwner } from '../context/OwnerContext';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { CreatePropertyDialog } from '../components/dialogs/CreatePropertyDialog';
import { EditPropertyDialog } from '../components/dialogs/EditPropertyDialog';
import { PropertyDetailsDialog } from '../components/dialogs/PropertyDetailsDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { PropertySkeleton } from '../components/ui/skeleton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MoreHorizontal, Plus, Edit2, Eye, Building2, Trash2 } from 'lucide-react';
import type { Property } from '../types/index';
import type { OwnerApartmentsGridResponse, PropertyApartmentsGridResponse } from '../../services/userService';

interface PropertyCardProps {
  property: Property;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  onDelete?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onViewDetails?: (property: Property) => void;
  onViewApartments?: (property: Property) => void;
}

function PropertyCard({
  property,
  totalUnits,
  occupiedUnits,
  monthlyRevenue,
  onDelete,
  onEdit,
  onViewDetails,
  onViewApartments,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const occupancyPercentage = totalUnits > 0
    ? Math.round((occupiedUnits / totalUnits) * 100)
    : 0;

  return (
    <div
      className="glass-card relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group cursor-pointer hover:border-white/[0.12]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewApartments?.(property)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="relative w-full h-[200px] overflow-hidden rounded-t-[16px]">
        <ImageWithFallback
          src={property.imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="p-[24px]">
        <div className="flex items-start justify-between mb-[12px]">
          <div className="flex-1">
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-primary mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {property.name}
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
              {property.address}
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-[4px] text-tertiary hover:text-primary transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.8)] min-w-[220px] z-[11] overflow-hidden py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit?.(property);
                  }}
                  className="w-full flex items-center gap-3 px-[16px] py-[10px] hover:bg-white/[0.06] transition-colors"
                >
                  <Edit2 size={16} className="text-secondary" />
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[14px] text-primary" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Edit Property
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onViewDetails?.(property);
                  }}
                  className="w-full flex items-center gap-3 px-[16px] py-[10px] hover:bg-white/[0.06] transition-colors"
                >
                  <Eye size={16} className="text-secondary" />
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[14px] text-primary" style={{ fontVariationSettings: "'wdth' 100" }}>
                    View Details
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onViewApartments?.(property);
                  }}
                  className="w-full flex items-center gap-3 px-[16px] py-[10px] hover:bg-white/[0.06] transition-colors"
                >
                  <Building2 size={16} className="text-secondary" />
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[14px] text-primary" style={{ fontVariationSettings: "'wdth' 100" }}>
                    View Apartments
                  </p>
                </button>
                <div className="border-t border-white/10 my-2" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete?.(property);
                  }}
                  className="w-full flex items-center gap-3 px-[16px] py-[10px] transition-colors hover:bg-[rgba(255,107,107,0.1)]"
                >
                  <Trash2 size={16} className="text-[#ff6b6b]" />
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[14px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Delete Property
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-[16px]">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-tertiary mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Monthly Revenue
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-[#928dd3] tracking-[-0.24px]">
            ${monthlyRevenue.toLocaleString()}
          </p>
        </div>

        {/* Additional info shown on hover */}
        <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-[16px] border-t border-white/[0.08]">
            <div className="flex gap-[24px]">
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-tertiary mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Units
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-primary tracking-[-0.2px]">
                  {totalUnits}
                </p>
              </div>
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-tertiary mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Occupancy
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-primary tracking-[-0.2px]">
                  {occupancyPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.15] transition-colors inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Properties() {
  const navigate = useNavigate();
  const { currentOwner, properties, isLoadingProperties, refreshProperties } = useOwner();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [propertyMetrics, setPropertyMetrics] = useState<Record<string, { totalUnits: number; occupiedUnits: number; monthlyRevenue: number }>>({});

  const buildMetricsFromGrid = (grid: PropertyApartmentsGridResponse) => {
    let totalUnits = 0;
    let occupiedUnits = 0;
    // Sum of rents that are PAID (actual income, not pending)
    let paidRentTotal = 0;
    // Sum of all expenses in the property
    let expensesTotal = 0;

    Object.values(grid).forEach((apartmentsByNumber) => {
      Object.values(apartmentsByNumber).forEach((apartment) => {
        totalUnits += 1;
        if (apartment.tenant) {
          occupiedUnits += 1;
          // Only count rent if payment status is PAID
          if (apartment.paymentStatus === 'PAID') {
            paidRentTotal += apartment.rent || 0;
          }
        }
        expensesTotal += (apartment.expenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0);
      });
    });

    const monthlyRevenue = paidRentTotal > 0 ? (paidRentTotal - expensesTotal) : 0;

    return {
      totalUnits,
      occupiedUnits,
      monthlyRevenue,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPropertyMetrics = async () => {
      setIsLoadingMetrics(true);
      if (properties.length === 0) {
        setPropertyMetrics({});
        setIsLoadingMetrics(false);
        return;
      }

      try {
        const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
        const ownerGrid: OwnerApartmentsGridResponse = await userService.getOwnerApartmentsGrid(
          isAdmin ? currentOwner.id : undefined
        );
        if (cancelled) return;

        const metrics: Record<string, { totalUnits: number; occupiedUnits: number; monthlyRevenue: number }> = {};
        properties.forEach((property) => {
          const grid = ownerGrid[property.id];
          metrics[property.id] = grid
            ? buildMetricsFromGrid(grid)
            : { totalUnits: 0, occupiedUnits: 0, monthlyRevenue: 0 };
        });

        setPropertyMetrics(metrics);
        setIsLoadingMetrics(false);
      } catch (error) {
        console.error('Error calculating property metrics', error);
        setIsLoadingMetrics(false);
      }
    };

    fetchPropertyMetrics();
    return () => {
      cancelled = true;
    };
  }, [properties, currentOwner.id]);

  const metricsForProperty = (propertyId: string) =>
    propertyMetrics[propertyId] ?? { totalUnits: 0, occupiedUnits: 0, monthlyRevenue: 0 };

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
  };

  const handleViewDetails = (property: Property) => {
    setViewingProperty(property);
  };

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-12 relative">
        <div>
          <h1 className="font-black text-4xl text-primary tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <Building2 className="text-[#928dd3]" size={36} />
            Properties
          </h1>
          <p className="text-tertiary text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Managing {properties.length} properties for {currentOwner.name}
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-[#928dd3] to-[#a89be6] content-stretch flex gap-2 items-center justify-center px-[16px] py-[8px] relative rounded-[10px] shrink-0 hover:opacity-100 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] ring-1 ring-white/20 hover:ring-white/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          <Plus size={18} className="text-black" />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Add Property
          </p>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[24px] px-[48px] pb-[48px]">
        {(isLoadingProperties || isLoadingMetrics) && properties.length > 0 ? (
          Array.from({ length: properties.length }).map((_, index) => (
            <PropertySkeleton key={`skeleton-${index}`} />
          ))
        ) : isLoadingProperties && properties.length === 0 ? (
          Array.from({ length: 3 }).map((_, index) => (
            <PropertySkeleton key={`skeleton-${index}`} />
          ))
        ) : properties.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-tertiary mb-4">No properties created yet</p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="text-[#928dd3] hover:text-[#a89be6] transition-colors"
            >
              Create your first property →
            </button>
          </div>
        ) : (
          properties.map((property) => {
            const metrics = metricsForProperty(property.id);
            return (
              <PropertyCard
                key={property.id}
                property={property}
                totalUnits={metrics.totalUnits}
                occupiedUnits={metrics.occupiedUnits}
                monthlyRevenue={metrics.monthlyRevenue}
                onDelete={handleDeleteProperty}
                onEdit={handleEditProperty}
                onViewDetails={handleViewDetails}
                onViewApartments={(p) => navigate(`/properties/${p.id}/apartments`)}
              />
            );
          })
        )}
      </div>

      <CreatePropertyDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => setShowCreateDialog(false)}
      />

      <EditPropertyDialog
        key={editingProperty?.id ?? 'no-property'}
        isOpen={!!editingProperty}
        property={editingProperty}
        onClose={() => setEditingProperty(null)}
        onSuccess={async () => {
          await refreshProperties();
        }}
      />

      <PropertyDetailsDialog
        isOpen={!!viewingProperty}
        property={viewingProperty}
        metrics={viewingProperty ? metricsForProperty(viewingProperty.id) : undefined}
        onClose={() => setViewingProperty(null)}
      />

      <ConfirmDeleteDialog
        isOpen={!!propertyToDelete}
        title="Delete Property"
        description={`Are you sure you want to delete "${propertyToDelete?.name}"? This action cannot be undone.`}
        onConfirm={async () => {
          if (!propertyToDelete) return;
          try {
            await userService.deleteProperty(propertyToDelete.id);
            await refreshProperties();
            setPropertyToDelete(null);
          } catch (e) {
            console.error("Error deleting property", e);
            alert('There was an error deleting the property.');
          }
        }}
        onClose={() => setPropertyToDelete(null)}
      />
    </div>
  );
}
