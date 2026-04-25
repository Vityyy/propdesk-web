import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useOwner } from '../context/OwnerContext';
import userService, { PropertyApartmentsGridResponse, ApartmentGridResponse } from '../../services/userService';

function UserIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );
}

export function Apartments() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { properties } = useOwner();
  const [gridData, setGridData] = useState<PropertyApartmentsGridResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const property = properties.find(p => p.id === propertyId);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    userService.getPropertyApartmentsGrid(propertyId)
      .then(data => {
        setGridData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching apartments', err);
        setLoading(false);
      });
  }, [propertyId]);

  const handleEditClick = (apartment: ApartmentGridResponse) => {
    // Other branch is working on the popup
    console.log('Edit apartment clicked:', apartment);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-full w-full flex items-center justify-center">
        <p className="text-white">Cargando apartamentos...</p>
      </div>
    );
  }

  // Convert the Record<number, Record<number, ApartmentGridResponse>> to sorted arrays for rendering
  const sortedFloors = gridData 
    ? Object.keys(gridData).map(Number).sort((a, b) => a - b)
    : [];

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="flex flex-col gap-[12px] w-full">
          <button 
            onClick={() => navigate('/properties')}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors self-start mb-4"
          >
            ← Volver a Propiedades
          </button>
          
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] text-white tracking-[-0.34px]">
                Apartamentos
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {property ? `Administrando ${property.name}` : 'Cargando datos de la propiedad...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[48px] pb-[48px] flex flex-col gap-12">
        {sortedFloors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[rgba(255,255,255,0.6)]">No hay pisos ni apartamentos registrados para esta propiedad.</p>
          </div>
        ) : (
          sortedFloors.map(floorNum => {
            const floorApartmentsMap = gridData![floorNum];
            const sortedApartmentNumbers = Object.keys(floorApartmentsMap).map(Number).sort((a, b) => a - b);
            
            return (
              <div key={floorNum} className="flex flex-col gap-6">
                <h3 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-white">
                  Piso {floorNum}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6 auto-rows-fr">
                  {sortedApartmentNumbers.map(aptNum => {
                    const apt = floorApartmentsMap[aptNum];
                    const isPaid = apt.payment_status === 'PAID';
                    
                    return (
                      <div 
                        key={apt.id} 
                        className="flex flex-col rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] bg-[#111]"
                      >
                        {/* Upper half: Background color & Icon */}
                        <div className={`relative h-[120px] flex items-center justify-center ${isPaid ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
                          <div className="text-white opacity-90 drop-shadow-md">
                            <UserIcon />
                          </div>
                          
                          {/* Payment status badge */}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white tracking-wide">
                            APT {aptNum}
                          </div>
                          
                          {/* Edit button */}
                          <button 
                            onClick={() => handleEditClick(apt)}
                            className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 backdrop-blur-sm p-1.5 rounded transition-colors text-white"
                            title="Editar datos del apartamento"
                          >
                            <EditIcon />
                          </button>
                        </div>
                        
                        {/* Lower half: Details */}
                        <div className="p-4 flex flex-col gap-3 flex-1 bg-[#1a1a1a]">
                          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Tenant</span>
                            <span className="text-sm text-white font-medium truncate max-w-[100px]" title={apt.tenant?.name || 'Vacante'}>
                              {apt.tenant ? apt.tenant.name : <span className="text-[rgba(255,255,255,0.3)] italic">Vacante</span>}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Rent</span>
                            <span className="text-sm text-[#928dd3] font-bold">${apt.rent}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Área</span>
                            <span className="text-sm text-white">{apt.square_meters} m²</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-auto pt-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Vence</span>
                            <span className="text-sm text-white">{apt.due_date || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
