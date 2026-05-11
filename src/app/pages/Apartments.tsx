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

function CreditCardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function Apartments() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { properties } = useOwner();
  const [gridData, setGridData] = useState<PropertyApartmentsGridResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [floorSearch, setFloorSearch] = useState('');

  const [selectedApartments, setSelectedApartments] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [editingApartments, setEditingApartments] = useState<ApartmentGridResponse[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDialogInitialSection, setEditDialogInitialSection] = useState<'data' | 'tenant' | 'expenses' | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addDialogFloor, setAddDialogFloor] = useState(0);
  const [addDialogNextNumber, setAddDialogNextNumber] = useState(0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<ApartmentGridResponse | null>(null);
  const [statusUpdatingApartmentIds, setStatusUpdatingApartmentIds] = useState<Set<string>>(new Set());

  const todayIso = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const property = properties.find(p => p.id === propertyId);

  // Convert the Record<number, Record<number, ApartmentGridResponse>> to sorted arrays for rendering
  const sortedFloors = gridData
    ? Object.keys(gridData).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b)
    : [];

  const filteredFloors = sortedFloors.filter(floorNum => {
    if (!floorSearch.trim()) return true;
    return floorNum.toString().includes(floorSearch.trim());
  });

  const flattenedApartments = useMemo(() => {
    if (!gridData) return [];
    const flat: ApartmentGridResponse[] = [];
    sortedFloors.forEach(floor => {
      const aptsMap = gridData[floor];
      if (!aptsMap) return;
      const sortedAptNums = Object.keys(aptsMap).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      sortedAptNums.forEach(num => {
        if (aptsMap[num]) flat.push(aptsMap[num]);
      });
    });
    return flat;
  }, [gridData, sortedFloors]);

  const fetchApartments = (forceRefresh = false) => {
    if (!propertyId) return;
    setLoading(true);
    userService.getPropertyApartmentsGrid(propertyId, { forceRefresh })
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
      if (newSelected.has(apt.id) && newSelected.size === 1) {
        newSelected.clear();
        setLastSelectedId(null);
      } else {
        newSelected.clear();
        newSelected.add(apt.id);
        setLastSelectedId(apt.id);
      }
    }

    setSelectedApartments(newSelected);
  };

  const handleEditClick = (e: React.MouseEvent, apt: ApartmentGridResponse) => {
    e.stopPropagation();
    setEditingApartments([apt]);
    setEditDialogInitialSection('data');
    setIsEditDialogOpen(true);
  };

  const handleOpenExpenseDetails = (e: React.MouseEvent, apt: ApartmentGridResponse) => {
    e.stopPropagation();
    setEditingApartments([apt]);
    setEditDialogInitialSection('expenses');
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

  const getNextAvailableApartmentNumber = (floor: number, apartmentNumbers: number[]) => {
    const usedNumbers = new Set(apartmentNumbers);
    const floorBasedStart = floor * 100 + 1;
    const usesFloorBasedNumbers = apartmentNumbers.some(num => num >= floorBasedStart && num < floorBasedStart + 100);
    let candidate = usesFloorBasedNumbers ? floorBasedStart : 1;

    while (usedNumbers.has(candidate)) {
      candidate += 1;
    }

    return candidate;
  };

  const patchApartmentInGrid = (apartmentId: string, changes: Partial<ApartmentGridResponse>): boolean => {
    if (!gridData) return false;

    const found = Object.values(gridData)
      .some(apartmentsByNumber => Object.values(apartmentsByNumber).some(apartment => apartment.id === apartmentId));
    if (!found) return false;

    setGridData(prev => {
      if (!prev) return prev;
      const nextGrid: PropertyApartmentsGridResponse = {};

      Object.entries(prev).forEach(([floorKey, apartmentsByNumber]) => {
        const nextApartmentsByNumber: Record<number, ApartmentGridResponse> = {};
        Object.entries(apartmentsByNumber).forEach(([aptNumberKey, apartmentData]) => {
          const numericAptNumber = Number(aptNumberKey);
          if (apartmentData.id === apartmentId) {
            nextApartmentsByNumber[numericAptNumber] = { ...apartmentData, ...changes };
          } else {
            nextApartmentsByNumber[numericAptNumber] = apartmentData;
          }
        });
        nextGrid[Number(floorKey)] = nextApartmentsByNumber;
      });

      return nextGrid;
    });

    return found;
  };

  const advanceDueDateOneMonth = (dueDate: string): string => {
    const parts = dueDate.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return dueDate;
    }

    const [year, month, day] = parts;
    const baseDate = new Date(year, month - 1, day);
    if (Number.isNaN(baseDate.getTime())) {
      return dueDate;
    }

    const nextMonthDate = new Date(year, month, 1);
    const lastDayOfNextMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(day, lastDayOfNextMonth);
    const result = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), targetDay);

    const resultYear = result.getFullYear();
    const resultMonth = String(result.getMonth() + 1).padStart(2, '0');
    const resultDay = String(result.getDate()).padStart(2, '0');
    return `${resultYear}-${resultMonth}-${resultDay}`;
  };

  const handleTogglePaymentStatus = async (e: React.MouseEvent, apt: ApartmentGridResponse) => {
    e.stopPropagation();
    if (!propertyId || !gridData || statusUpdatingApartmentIds.has(apt.id)) {
      return;
    }

    const nextStatus = apt.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
    const shouldAdvanceDueDate = nextStatus === 'PAID' && !!apt.dueDate && apt.dueDate <= todayIso;
    const nextDueDate = shouldAdvanceDueDate && apt.dueDate ? advanceDueDateOneMonth(apt.dueDate) : apt.dueDate;
    const payload: { paymentStatus: 'PAID' | 'PENDING'; dueDate?: string } = { paymentStatus: nextStatus };

    if (nextStatus === 'PAID' && nextDueDate) {
      payload.dueDate = nextDueDate;
    }

    const previousGridSnapshot = gridData;

    // Optimistic update: mutate only the changed apartment in local grid state.
    setGridData(prev => {
      if (!prev) return prev;
      const nextGrid: PropertyApartmentsGridResponse = {};

      Object.entries(prev).forEach(([floorKey, apartmentsByNumber]) => {
        const nextApartmentsByNumber: Record<number, ApartmentGridResponse> = {};
        Object.entries(apartmentsByNumber).forEach(([numberKey, apartmentData]) => {
          const numericKey = Number(numberKey);
          nextApartmentsByNumber[numericKey] = apartmentData.id === apt.id
            ? {
              ...apartmentData,
              paymentStatus: nextStatus,
              dueDate: nextDueDate,
            }
            : apartmentData;
        });
        nextGrid[Number(floorKey)] = nextApartmentsByNumber;
      });

      return nextGrid;
    });

    setStatusUpdatingApartmentIds(prev => {
      const next = new Set(prev);
      next.add(apt.id);
      return next;
    });

    try {
      await userService.updateApartment(apt.id, payload);
      // Keep current view responsive without full refetch; force reload next visit.
      userService.invalidatePropertyApartmentsGrid(propertyId);
    } catch (error: any) {
      setGridData(previousGridSnapshot);
      console.error('Error updating payment status', error);
      alert(error?.message || 'Failed to update apartment status');
    } finally {
      setStatusUpdatingApartmentIds(prev => {
        const next = new Set(prev);
        next.delete(apt.id);
        return next;
      });
    }
  };

  const performDelete = async () => {
    if (!apartmentToDelete) return;
    try {
      await userService.deleteApartment(apartmentToDelete.id);
      setSelectedApartments(new Set());
      if (propertyId) {
        userService.invalidatePropertyApartmentsGrid(propertyId);
      }
      fetchApartments(true);
    } catch (err: any) {
      console.error('Error deleting apartment', err);
      alert(err.message || 'Failed to delete apartment');
      throw err; // Re-throw to keep dialog open if error, or let dialog handle it? The dialog catches and handles state, but expects a Promise.
    }
  };

  if (loading) {
    return (
      <div className="min-h-full w-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
        <p className="text-tertiary">Loading apartments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="flex flex-col gap-[12px] w-full">
          <button
            onClick={() => navigate('/properties')}
            className="text-tertiary hover:text-secondary transition-colors self-start mb-4"
          >
            ← Back to Properties
          </button>

          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] text-primary tracking-[-0.34px]">
                Apartments
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
                {property ? `Managing ${property.name}` : 'Loading property data...'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-tertiary text-sm font-semibold">Floor:</label>
              <input
                type="number"
                placeholder="Search floor..."
                value={floorSearch}
                onChange={e => setFloorSearch(e.target.value)}
                className="bg-white/[0.02] border border-white/[0.1] rounded-lg px-3 py-1.5 text-primary placeholder-white/25 text-sm focus:outline-none focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3]/30 transition-colors w-32"
              />
            </div>
          </div>

          <div className="bg-[#928dd3]/5 border border-[#928dd3]/20 rounded-lg p-3 w-fit text-[#928dd3]/80 text-sm flex gap-4 mt-2">
            <p><strong className="font-bold">Click:</strong> Select one</p>
            <p><strong className="font-bold">Ctrl + Click:</strong> Select multiple</p>
            <p><strong className="font-bold">Shift + Click:</strong> Select range</p>
          </div>
        </div>
      </div>

      <div className="px-[48px] pb-[48px] flex flex-col gap-12 relative">
        {selectedApartments.size > 0 && (
          <div className="sticky top-[24px] z-40 glass-card border border-[#928dd3]/30 rounded-xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <span className="text-primary font-semibold">
              {selectedApartments.size} apartment{selectedApartments.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedApartments(new Set())}
                className="px-4 py-2 border border-white/[0.1] text-secondary hover:bg-white/[0.05] hover:text-primary rounded-lg transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkEditClick}
                className="px-4 py-2 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black hover:opacity-90 rounded-lg transition-colors text-sm font-bold shadow-[0_0_15px_rgba(146,141,211,0.3)]"
              >
                Edit Selection
              </button>
            </div>
          </div>
        )}
        {sortedFloors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-tertiary">No floors or apartments registered for this property.</p>
          </div>
        ) : filteredFloors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-tertiary">No floors match your search.</p>
          </div>
        ) : (
          filteredFloors.map(floorNum => {
            const floorApartmentsMap = gridData![floorNum];
            if (!floorApartmentsMap) return null;
            const sortedApartmentNumbers = Object.keys(floorApartmentsMap).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);

            return (
              <div key={floorNum} className="flex flex-col gap-6">
                <h3 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-secondary">
                  Floor {floorNum}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 auto-rows-fr">
                  {sortedApartmentNumbers.map(aptNum => {
                    const apt = floorApartmentsMap[aptNum];
                    const isVacant = !apt.tenant;
                    const isPaid = apt.paymentStatus === 'PAID';
                    const isOverdue = !!apt.dueDate && apt.dueDate < todayIso;
                    const hasExpenses = apt.expenses && apt.expenses.length > 0;
                    const expensesTotal = (apt.expenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0);
                    const hasExpenseDeductions = expensesTotal > 0;
                    const rentGain = (apt.rent || 0) - expensesTotal;
                    const isStatusUpdating = statusUpdatingApartmentIds.has(apt.id);

                    // Card background color
                    let bgClass = 'bg-gray-600/80';
                    if (!isVacant) {
                      bgClass = (!isPaid || isOverdue) ? 'bg-red-600/80' : 'bg-green-600/80';
                    }

                    // Rent gain color
                    let rentColor = '#928dd3'; // default purple (vacant)
                    if (!isVacant) {
                      if (!isPaid) {
                        rentColor = '#f87171'; // red when unpaid
                      } else if (hasExpenseDeductions) {
                        rentColor = '#f59e0b'; // orange when there are expenses
                      } else {
                        rentColor = rentGain >= 0 ? '#4ade80' : '#f87171';
                      }
                    }

                    const isSelected = selectedApartments.has(apt.id);

                    return (
                      <div
                        key={apt.id}
                        onClick={(e) => handleCardClick(apt, e)}
                        className={`flex flex-col rounded-xl border transition-all hover:scale-[1.02] bg-[#111] cursor-pointer select-none ${isSelected ? 'border-[#928dd3] ring-2 ring-[#928dd3]/50 transform scale-[1.02]' : 'border-[rgba(255,255,255,0.1)]'}`}
                      >
                        {/* Upper half: Background color & Icon */}
                        <div className={`relative h-[140px] flex items-center justify-center overflow-hidden rounded-t-xl ${bgClass}`}>
                          <div className={`text-primary opacity-90 drop-shadow-md ${isVacant ? 'opacity-50' : ''}`}>
                            <UserIcon />
                          </div>

                          {/* Apt number badge */}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary tracking-wide">
                            APT {aptNum}
                          </div>

                          {/* Quick payment status toggle */}
                          <button
                            onClick={(e) => handleTogglePaymentStatus(e, apt)}
                            disabled={isStatusUpdating || isVacant}
                            className={`absolute top-11 left-3 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold tracking-wide flex items-center gap-1 border transition-colors ${isVacant
                              ? 'bg-white/10 border-white/20 text-tertiary'
                              : isPaid
                                ? 'bg-[#4ade80]/15 border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/25'
                                : 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/25'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              isVacant
                                ? 'No tenant assigned (no rent due yet)'
                                : isPaid
                                  ? 'Mark as unpaid (due date stays the same)'
                                  : 'Mark as paid (due date advances one month)'
                            }
                          >
                            <CreditCardIcon />
                            <span>{isStatusUpdating ? '...' : isVacant ? 'N/A' : isPaid ? 'Paid' : 'Unpaid'}</span>
                          </button>

                          {/* Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                            {/* Edit button */}
                            <button
                              onClick={(e) => handleEditClick(e, apt)}
                              className="bg-black/40 hover:bg-black/70 backdrop-blur-sm p-1.5 rounded transition-colors text-primary"
                              title="Edit apartment data"
                            >
                              <EditIcon />
                            </button>
                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteClick(e, apt)}
                              className="bg-black/40 hover:bg-[#ff6b6b]/80 backdrop-blur-sm p-1.5 rounded transition-colors text-[#ff6b6b] hover:text-primary"
                              title="Delete apartment"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>

                        {/* Lower half: Details */}
                        <div className="p-4 flex flex-col gap-3 flex-1 bg-[#1a1a1a] rounded-b-xl overflow-visible">
                          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Tenant</span>
                            <span className="text-sm text-primary font-medium truncate max-w-[140px]" title={apt.tenant?.name || 'Vacant'}>
                              {apt.tenant ? apt.tenant.name : <span className="text-[rgba(255,255,255,0.3)] italic">Vacant</span>}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Rent Gain</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold" style={{ color: rentColor }}>${rentGain}</span>
                              {!isVacant && !isPaid && (
                                <span className="relative group">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                  </svg>
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-[#1a1a1a] border border-[#f87171]/30 text-[#f87171] text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none">
                                    Unpaid rent — payment is pending
                                  </span>
                                </span>
                              )}
                              {isPaid && hasExpenseDeductions && (
                                <span
                                  className="relative group"
                                  title={`${apt.expenses?.length || 0} expense(s). Changes due to expenses. Maintenance fees do not affect rent gain.`}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => handleOpenExpenseDetails(e, apt)}
                                    className="p-0 m-0 bg-transparent border-0"
                                    title="Changes due to expenses. Click to see details"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                                      <circle cx="12" cy="12" r="10" />
                                      <line x1="12" y1="8" x2="12" y2="12" />
                                      <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                  </button>
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-[#1a1a1a] border border-[#f59e0b]/30 text-[#f59e0b] text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none">
                                    Changes due to expenses. See details
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Area</span>
                            <span className="text-sm text-primary">{apt.squareMeters} m²</span>
                          </div>

                          <div className="flex justify-between items-center mt-auto pt-2">
                            <span className="text-[12px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">Due</span>
                            <span className="text-sm text-primary">{apt.dueDate || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Apartment Card */}
                  <div 
                    onClick={() => handleAddClick(floorNum, getNextAvailableApartmentNumber(floorNum, sortedApartmentNumbers))}
                    className="flex flex-col rounded-xl overflow-hidden border border-[#4ade80]/30 transition-all hover:scale-[1.02] bg-[#4ade80]/5 hover:bg-[#4ade80]/10 cursor-pointer min-h-[290px] items-center justify-center text-[#4ade80]"
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
        propertyId={propertyId || ''}
        apartments={editingApartments}
        initialSection={editDialogInitialSection}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditDialogInitialSection(null);
        }}
        onSuccess={(result) => {
          setSelectedApartments(new Set());
          if (result?.apartmentId && result.changes) {
            const updatedLocally = patchApartmentInGrid(result.apartmentId, result.changes);
            if (propertyId) {
              userService.invalidatePropertyApartmentsGrid(propertyId);
            }
            if (updatedLocally) {
              return;
            }
          }
          if (propertyId) {
            userService.invalidatePropertyApartmentsGrid(propertyId);
          }
          fetchApartments(true);
        }}
      />

      <AddSingleApartmentDialog
        isOpen={isAddDialogOpen}
        propertyId={propertyId || ''}
        floor={addDialogFloor}
        nextNumber={addDialogNextNumber}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          if (propertyId) {
            userService.invalidatePropertyApartmentsGrid(propertyId);
          }
          fetchApartments(true);
        }}
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
