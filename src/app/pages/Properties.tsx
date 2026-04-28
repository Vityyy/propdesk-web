import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOwner } from '../context/OwnerContext';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { CreatePropertyDialog } from '../components/dialogs/CreatePropertyDialog';
import { EditPropertyDialog } from '../components/dialogs/EditPropertyDialog';
import { PropertyDetailsDialog } from '../components/dialogs/PropertyDetailsDialog';
import svgPaths from "../../imports/svg-zayt9vop9f";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { Property } from '../types/index';
import type { OwnerApartmentsGridResponse, PropertyApartmentsGridResponse } from '../../services/userService';

function DotsHorizontal() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="dots-horizontal">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="dots-horizontal">
          <path clipRule="evenodd" d={svgPaths.p3d5ea200} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  onDelete?: (id: string) => void;
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

  const occupancyPercentage = totalUnits > 0
    ? Math.round((occupiedUnits / totalUnits) * 100)
    : 0;

  return (
    <div 
      className="bg-black relative rounded-[16px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewApartments?.(property)}
    >
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
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {property.name}
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {property.address}
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="hover:opacity-70 transition-opacity p-[4px]"
            >
              <DotsHorizontal />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-[10]" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute top-[calc(100%+8px)] right-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[200px] z-[11] overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit?.(property);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Edit Property
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onViewDetails?.(property);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      View Details
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onViewApartments?.(property);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      View Apartments
                    </p>
                  </button>
                  <div className="border-t border-[rgba(255,255,255,0.16)]" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete?.(property.id);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,0,0,0.1)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Delete Property
                    </p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-[16px]">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Monthly Revenue
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-[#928dd3] tracking-[-0.24px]">
            ${monthlyRevenue.toLocaleString()}
          </p>
        </div>

        {/* Additional info shown on hover */}
        <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-[16px] border-t border-[rgba(255,255,255,0.16)]">
            <div className="flex gap-[24px]">
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Units
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
                  {totalUnits}
                </p>
              </div>
              <div>
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Occupancy
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
                  {occupancyPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Properties() {
  const navigate = useNavigate();
  const { currentOwner, properties, refreshProperties } = useOwner();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [propertyMetrics, setPropertyMetrics] = useState<Record<string, { totalUnits: number; occupiedUnits: number; monthlyRevenue: number }>>({});

  const buildMetricsFromGrid = (grid: PropertyApartmentsGridResponse) => {
    let totalUnits = 0;
    let occupiedUnits = 0;
    let paidRentTotal = 0;
    let expensesTotal = 0;

    Object.values(grid).forEach((apartmentsByNumber) => {
      Object.values(apartmentsByNumber).forEach((apartment) => {
        totalUnits += 1;
        if (apartment.tenant) {
          occupiedUnits += 1;
        }
        if (apartment.paymentStatus === 'PAID') {
          paidRentTotal += apartment.rent || 0;
        }
        expensesTotal += (apartment.expenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0);
      });
    });

    return {
      totalUnits,
      occupiedUnits,
      monthlyRevenue: paidRentTotal - expensesTotal,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPropertyMetrics = async () => {
      if (properties.length === 0) {
        setPropertyMetrics({});
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
      } catch (error) {
        console.error('Error calculating property metrics', error);
      }
    };

    fetchPropertyMetrics();
    return () => {
      cancelled = true;
    };
  }, [properties, currentOwner.id]);

  const metricsForProperty = (propertyId: string) =>
    propertyMetrics[propertyId] ?? { totalUnits: 0, occupiedUnits: 0, monthlyRevenue: 0 };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await userService.deleteProperty(propertyId);
        refreshProperties();
      } catch (e) {
        console.error("Error deleting property", e);
        alert('There was an error deleting the property.');
      }
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
  };

  const handleViewDetails = (property: Property) => {
    setViewingProperty(property);
  };

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Properties
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Managing {properties.length} properties for {currentOwner.name}
            </p>
          </div>
          <button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors"
          >
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add Property
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[24px] px-[48px] pb-[48px]">
        {properties.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-[rgba(255,255,255,0.6)] mb-4">No properties created yet</p>
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
        onSuccess={() => {
          setEditingProperty(null);
          refreshProperties();
        }}
      />

      <PropertyDetailsDialog
        isOpen={!!viewingProperty}
        property={viewingProperty}
        metrics={viewingProperty ? metricsForProperty(viewingProperty.id) : undefined}
        onClose={() => setViewingProperty(null)}
      />
    </div>
  );
}
