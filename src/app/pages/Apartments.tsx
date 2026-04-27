import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useOwner } from '../context/OwnerContext';
import userService, { PropertyApartmentsGridResponse, ApartmentGridResponse } from '../../services/userService';
import { EditApartmentsDialog } from '../components/dialogs/EditApartmentsDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { AddSingleApartmentDialog } from '../components/dialogs/AddSingleApartmentDialog';

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

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"></path>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export function Apartments() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { properties } = useOwner();
  const [gridData, setGridData] = useState<PropertyApartmentsGridResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedApartments, setSelectedApartments] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [editingApartments, setEditingApartments] = useState<ApartmentGridResponse[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addDialogFloor, setAddDialogFloor] = useState(0);
  const [addDialogNextNumber, setAddDialogNextNumber] = useState(0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<ApartmentGridResponse | null>(null);

  const property = properties.find(p => p.id === propertyId);

  // Convert the Record<number, Record<number, ApartmentGridResponse>> to sorted arrays for rendering
  const sortedFloors = gridData 
    ? Object.keys(gridData).map(Number).sort((a, b) => a - b)
    : [];

  const flattenedApartments = useMemo(() => {
    if (!gridData) return [];
    const flat: ApartmentGridResponse[] = [];
    sortedFloors.forEach(floor => {
      const aptsMap = gridData[floor];
      const sortedAptNums = Object.keys(aptsMap).map(Number).sort((a, b) => a - b);
      sortedAptNums.forEach(num => {
        flat.push(aptsMap[num]);
      });
    });
    return flat;
  }, [gridData, sortedFloors]);

  const fetchApartments = () => {
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
  };

  useEffect(() => {
    fetchApartments();
  }, [propertyId]);

  const handleCardClick = (apt: ApartmentGridResponse, e: React.MouseEvent) => {
    const newSelected = new Set(selectedApartments);

    if (e.shiftKey && lastSelectedId) {
      // Find indices
      const startIdx = flattenedApartments.findIndex(a => a.id === lastSelectedId);
      const endIdx = flattenedApartments.findIndex(a => a.id === apt.id);
      
      if (startIdx !== -1 && endIdx !== -1) {
        const min = Math.min(startIdx, endIdx);
        const max = Math.max(startIdx, endIdx);
        for (let i = min; i <= max; i++) {
          newSelected.add(flattenedApartments[i].id);
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (newSelected.has(apt.id)) {
        newSelected.delete(apt.id);
      } else {
        newSelected.add(apt.id);
      }
      setLastSelectedId(apt.id);
    } else {
      newSelected.clear();
      newSelected.add(apt.id);
      setLastSelectedId(apt.id);
    }

    setSelectedApartments(newSelected);
  };

  const handleEditClick = (e: React.MouseEvent, apt: ApartmentGridResponse) => {
    e.stopPropagation();
    setEditingApartments([apt]);
    setIsEditDialogOpen(true);
  };

  const handleBulkEditClick = () => {
    const selectedApts = flattenedApartments.filter(a => selectedApartments.has(a.id));
    setEditingApartments(selectedApts);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, apt: ApartmentGridResponse) => {
    e.stopPropagation();
    setApartmentToDelete(apt);
    setIsDeleteDialogOpen(true);
  };

  const handleAddClick = (floor: number, nextNum: number) => {
    setAddDialogFloor(floor);
    setAddDialogNextNumber(nextNum);
    setIsAddDialogOpen(true);
  };

  const performDelete = async () => {
    if (!apartmentToDelete) return;
    try {
      await userService.deleteApartment(apartmentToDelete.id);
      setSelectedApartments(new Set());
      fetchApartments();
    } catch (err: any) {
      console.error('Error deleting apartment', err);
      alert(err.message || 'Failed to delete apartment');
      throw err; // Re-throw to keep dialog open if error, or let dialog handle it? The dialog catches and handles state, but expects a Promise.
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-full w-full flex items-center justify-center">
        <p className="text-white">Loading apartments...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="flex flex-col gap-[12px] w-full">
          <button 
            onClick={() => navigate('/properties')}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors self-start mb-4"
          >
            ← Back to Properties
          </button>
          
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] text-white tracking-[-0.34px]">
                Apartments
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {property ? `Managing ${property.name}` : 'Loading property data...'}
              </p>
            </div>
          </div>
          
          <div className="bg-[#928dd3]/10 border border-[#928dd3]/30 rounded-lg p-3 w-fit text-[#928dd3] text-sm flex gap-4 mt-2">
            <p><strong className="font-bold">Click:</strong> Select one</p>
            <p><strong className="font-bold">Ctrl + Click:</strong> Select multiple</p>
            <p><strong className="font-bold">Shift + Click:</strong> Select range</p>
          </div>
        </div>
      </div>

      <div className="px-[48px] pb-[48px] flex flex-col gap-12 relative">
        {selectedApartments.size > 0 && (
          <div className="sticky top-[24px] z-40 bg-[#111] border border-[#928dd3] rounded-xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <span className="text-white font-semibold">
              {selectedApartments.size} apartment{selectedApartments.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedApartments(new Set())}
                className="px-4 py-2 border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkEditClick}
                className="px-4 py-2 bg-[#928dd3] text-black hover:bg-[#a89be6] rounded-lg transition-colors text-sm font-bold"
              >
                Edit Selection
              </button>
            </div>
          </div>
        )}
        {sortedFloors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[rgba(255,255,255,0.6)]">No floors or apartments registered for this property.</p>
          </div>
        ) : (
          sortedFloors.map(floorNum => {
            const floorApartmentsMap = gridData![floorNum];
            const sortedApartmentNumbers = Object.keys(floorApartmentsMap).map(Number).sort((a, b) => a - b);
            
            return (
              <div key={floorNum} className="flex flex-col gap-6">
                <h3 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-white">
                  Floor {floorNum}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6 auto-rows-fr">
                  {sortedApartmentNumbers.map(aptNum => {
                    const apt = floorApartmentsMap[aptNum];
                    const isVacant = !apt.tenant;
                    const isPaid = apt.paymentStatus === 'PAID';
                    const hasExpenses = apt.expenses && apt.expenses.length > 0;

                    // Card background color
                    let bgClass = 'bg-gray-600/80';
                    if (!isVacant) {
                      bgClass = isPaid ? 'bg-green-600/80' : 'bg-red-600/80';
                    }

                    // Rent value color
                    let rentColor = '#928dd3'; // default purple (vacant)
                    if (!isVacant) {
                      if (hasExpenses) {
                        rentColor = '#f59e0b'; // orange when there are expenses
                      } else if (isPaid) {
                        rentColor = '#4ade80'; // green when paid, no expenses
                      } else {
                        rentColor = '#f87171'; // red when unpaid
                      }
                    }

                    const isSelected = selectedApartments.has(apt.id);

                    return (
                      <div 
                        key={apt.id} 
                        onClick={(e) => handleCardClick(apt, e)}
                        className={`flex flex-col rounded-xl overflow-hidden border transition-all hover:scale-[1.02] bg-[#111] cursor-pointer select-none ${isSelected ? 'border-[#928dd3] ring-2 ring-[#928dd3]/50 transform scale-[1.02]' : 'border-[rgba(255,255,255,0.1)]'}`}
                      >
                        {/* Upper half: Background color & Icon */}
                        <div className={`relative h-[120px] flex items-center justify-center ${bgClass}`}>
                          <div className={`text-white opacity-90 drop-shadow-md ${isVacant ? 'opacity-50' : ''}`}>
                            <UserIcon />
                          </div>
                          
                          {/* Apt number badge */}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white tracking-wide">
                            APT {aptNum}
                          </div>
                          
                          {/* Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                            {/* Edit button */}
                            <button 
                              onClick={(e) => handleEditClick(e, apt)}
                              className="bg-black/40 hover:bg-black/70 backdrop-blur-sm p-1.5 rounded transition-colors text-white"
                              title="Edit apartment data"
                            >
                              <EditIcon />
                            </button>
                            {/* Delete button */}
                            <button 
                              onClick={(e) => handleDeleteClick(e, apt)}
                              className="bg-black/40 hover:bg-[#ff6b6b]/80 backdrop-blur-sm p-1.5 rounded transition-colors text-[#ff6b6b] hover:text-white"
                              title="Delete apartment"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                        
                        {/* Lower half: Details */}
                        <div className="p-4 flex flex-col gap-3 flex-1 bg-[#1a1a1a]">
                          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Tenant</span>
                            <span className="text-sm text-white font-medium truncate max-w-[100px]" title={apt.tenant?.name || 'Vacant'}>
                              {apt.tenant ? apt.tenant.name : <span className="text-[rgba(255,255,255,0.3)] italic">Vacant</span>}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Rent</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold" style={{ color: rentColor }}>${apt.rent}</span>
                              {hasExpenses && (
                                <span
                                  className="relative group"
                                  title={`${apt.expenses.length} expense${apt.expenses.length > 1 ? 's' : ''}. See details`}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-help">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                  </svg>
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-[#1a1a1a] border border-[#f59e0b]/30 text-[#f59e0b] text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none">
                                    Expenses. See details
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Area</span>
                            <span className="text-sm text-white">{apt.squareMeters} m²</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-auto pt-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Due</span>
                            <span className="text-sm text-white">{apt.dueDate || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Apartment Card */}
                  <div 
                    onClick={() => handleAddClick(floorNum, sortedApartmentNumbers.length > 0 ? sortedApartmentNumbers[sortedApartmentNumbers.length - 1] + 1 : floorNum * 100 + 1)}
                    className="flex flex-col rounded-xl overflow-hidden border border-[#4ade80]/30 transition-all hover:scale-[1.02] bg-[#4ade80]/5 hover:bg-[#4ade80]/10 cursor-pointer min-h-[250px] items-center justify-center text-[#4ade80]"
                    title={`Add apartment to floor ${floorNum}`}
                  >
                    <PlusIcon />
                    <span className="mt-4 font-bold text-sm tracking-wide">Add APT</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <EditApartmentsDialog 
        isOpen={isEditDialogOpen}
        apartments={editingApartments}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={() => {
          setSelectedApartments(new Set());
          fetchApartments();
        }}
      />

      <AddSingleApartmentDialog
        isOpen={isAddDialogOpen}
        propertyId={propertyId || ''}
        floor={addDialogFloor}
        nextNumber={addDialogNextNumber}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={fetchApartments}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Apartment"
        description={`Are you sure you want to delete APT ${apartmentToDelete?.number}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={performDelete}
      />
    </div>
  );
}
