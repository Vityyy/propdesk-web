import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { propertyService } from '../../services/propertyService';
import userService from '../../services/userService';
import { CreatePropertyDialog } from '../components/dialogs/CreatePropertyDialog';
import { EditPropertyDialog } from '../components/dialogs/EditPropertyDialog';
import { PropertyDetailsDialog } from '../components/dialogs/PropertyDetailsDialog';
import svgPaths from "../../imports/svg-zayt9vop9f";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { Property } from '../types/index';

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
  onDelete?: (id: string) => void;
  onEdit?: (property: Property) => void;
  onViewDetails?: (property: Property) => void;
}

function PropertyCard({ property, onDelete, onEdit, onViewDetails }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const occupancyPercentage = property.totalUnits > 0 
    ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
    : 0;

  const totalMonthlyRevenue = property.units
    .filter(u => u.status === 'occupied')
    .reduce((sum, u) => sum + u.rentAmount, 0);

  return (
    <div 
      className="bg-black relative rounded-[16px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[200px] overflow-hidden">
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
              onClick={() => setShowMenu(!showMenu)}
              className="hover:opacity-70 transition-opacity p-[4px]"
            >
              <DotsHorizontal />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-[10]" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-[calc(100%+8px)] right-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[200px] z-[11] overflow-hidden">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit?.(property);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Editar Propiedad
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onViewDetails?.(property);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Ver Detalles
                    </p>
                  </button>
                  <div className="border-t border-[rgba(255,255,255,0.16)]" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete?.(property.id);
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,0,0,0.1)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Eliminar Propiedad
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
            ${totalMonthlyRevenue.toLocaleString()}
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
                  {property.totalUnits}
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
  const { currentOwner, properties, refreshProperties } = useOwner();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      try {
        await userService.deleteProperty(propertyId);
        refreshProperties();
      } catch (e) {
        console.error("Error al eliminar la propiedad", e);
        alert('Hubo un error eliminando la propiedad.');
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
            <p className="text-[rgba(255,255,255,0.6)] mb-4">No hay propiedades creadas aún</p>
            <button 
              onClick={() => setShowCreateDialog(true)}
              className="text-[#928dd3] hover:text-[#a89be6] transition-colors"
            >
              Crear la primera propiedad →
            </button>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onDelete={handleDeleteProperty}
              onEdit={handleEditProperty}
              onViewDetails={handleViewDetails}
            />
          ))
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
        onClose={() => setViewingProperty(null)}
      />
    </div>
  );
}
