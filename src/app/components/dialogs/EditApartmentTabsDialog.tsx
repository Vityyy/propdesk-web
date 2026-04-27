import { useState, useEffect } from 'react';
import userService, {
  ApartmentGridResponse,
  ApartmentExpenseResponse,
  TenantGridResponse,
} from '../../../services/userService';
import { parseRange } from '../../../utils/rangeParser';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface EditApartmentTabsDialogProps {
  isOpen: boolean;
  propertyId: string;
  apartment: ApartmentGridResponse;
  initialSection?: 'data' | 'tenant' | 'expenses' | null;
  onClose: () => void;
  onSuccess?: (result?: { apartmentId: string; changes: Partial<ApartmentGridResponse> }) => void;
}

// ─── Accordion wrapper ───────────────────────────────────────────────────────

function Accordion({
  title,
  open,
  onToggle,
  children,
  accentColor = '#928dd3',
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="border rounded-xl overflow-hidden transition-all"
      style={{ borderColor: open ? accentColor : 'rgba(255,255,255,0.1)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span
          className="font-bold text-sm tracking-wide uppercase"
          style={{ color: open ? accentColor : 'rgba(255,255,255,0.7)' }}
        >
          {title}
        </span>
        <span style={{ color: open ? accentColor : 'rgba(255,255,255,0.4)' }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? '800px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div className="px-5 pb-5 pt-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Sub-form: Apartment Data ────────────────────────────────────────────────

function ApartmentDataSection({
  apartment,
  onSuccess,
}: {
  apartment: ApartmentGridResponse;
  onSuccess: (changes: Partial<ApartmentGridResponse>) => void;
}) {
  const [rent, setRent] = useState(apartment.rent?.toString() ?? '');
  const [sqm, setSqm] = useState(apartment.squareMeters?.toString() ?? '');
  const [dueDate, setDueDate] = useState(apartment.dueDate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setError(null);
    const updates: { rent?: number; squareMeters?: number; dueDate?: string } = {};
    if (rent.trim()) {
      const v = parseFloat(rent);
      if (isNaN(v) || v <= 0) { setError('Rent must be a positive number'); return; }
      updates.rent = v;
    }
    if (sqm.trim()) {
      const v = parseFloat(sqm);
      if (isNaN(v) || v <= 0) { setError('Area must be a positive number'); return; }
      updates.squareMeters = v;
    }
    if (dueDate.trim()) {
      updates.dueDate = dueDate;
    }
    setSaving(true);
    try {
      await userService.updateApartment(apartment.id, updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSuccess({
        rent: updates.rent ?? apartment.rent,
        squareMeters: updates.squareMeters ?? apartment.squareMeters,
        dueDate: updates.dueDate ?? apartment.dueDate,
      });
    } catch (e: any) {
      setError(e.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Rent Value ($)</label>
        <input
          type="number" step="0.01" value={rent}
          onChange={e => setRent(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#928dd3] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
          placeholder="e.g. 1500.00"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Area (m²)</label>
        <input
          type="number" step="0.01" value={sqm}
          onChange={e => setSqm(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#928dd3] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
          placeholder="e.g. 45.5"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          Due Date <span className="text-white/35 normal-case">(rent due day)</span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#928dd3] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
        />
      </div>
      <button
        type="button" onClick={handleSave} disabled={saving}
        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#928dd3] hover:bg-[#a89be6] text-black'} disabled:opacity-50`}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Apartment Data'}
      </button>
    </div>
  );
}

// ─── Sub-form: Tenant ────────────────────────────────────────────────────────

function TenantSection({
  propertyId,
  apartment,
  onSuccess,
}: {
  propertyId: string;
  apartment: ApartmentGridResponse;
  onSuccess?: (result?: { apartmentId: string; changes: Partial<ApartmentGridResponse> }) => void;
}) {
  const [currentTenant, setCurrentTenant] = useState<TenantGridResponse | null>(apartment.tenant ?? null);
  const hasTenant = !!currentTenant;
  const [name, setName] = useState(apartment.tenant?.name ?? '');
  const [phone, setPhone] = useState(apartment.tenant?.phone ?? '');
  const [email, setEmail] = useState(apartment.tenant?.email ?? '');
  const [dueDate, setDueDate] = useState(apartment.dueDate ?? '');
  const [saving, setSaving] = useState(false);
  const [vacating, setVacating] = useState(false);
  const [isVacateDialogOpen, setIsVacateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [floorRanges, setFloorRanges] = useState('');
  const [apartmentRanges, setApartmentRanges] = useState('');
  const [specialModsError, setSpecialModsError] = useState<string | null>(null);
  const [specialModsSummary, setSpecialModsSummary] = useState<string | null>(null);

  const parseSpecialModifications = () => {
    if (!floorRanges.trim() && !apartmentRanges.trim()) {
      setSpecialModsError(null);
      setSpecialModsSummary(null);
      return true;
    }

    if (!floorRanges.trim() || !apartmentRanges.trim()) {
      setSpecialModsError('To use special modifications, complete both floor and apartment ranges.');
      setSpecialModsSummary(null);
      return false;
    }

    try {
      const parsedFloors = parseRange(floorRanges);
      const parsedApartments = parseRange(apartmentRanges);

      const floorsCount = parsedFloors.reduce((sum, interval) => sum + (interval.end - interval.start + 1), 0);
      const apartmentsCount = parsedApartments.reduce((sum, interval) => sum + (interval.end - interval.start + 1), 0);
      const targetUnits = floorsCount * apartmentsCount;

      setSpecialModsError(null);
      setSpecialModsSummary(`Parsed successfully. Reference block covers ${targetUnits} units.`);
      return true;
    } catch (parseError: any) {
      setSpecialModsError(parseError?.message || 'Invalid ranges format');
      setSpecialModsSummary(null);
      return false;
    }
  };

  const expandIntervals = (intervals: Array<{ start: number; end: number }>): number[] => {
    return intervals.flatMap(interval =>
      Array.from({ length: interval.end - interval.start + 1 }, (_, idx) => interval.start + idx)
    );
  };

  useEffect(() => {
    setCurrentTenant(apartment.tenant ?? null);
    setName(apartment.tenant?.name ?? '');
    setPhone(apartment.tenant?.phone ?? '');
    setEmail(apartment.tenant?.email ?? '');
    setDueDate(apartment.dueDate ?? '');
    setShowAddForm(false);
    setError(null);
  }, [apartment.id, apartment.tenant, apartment.dueDate]);

  const handleSave = async () => {
    setError(null);
    if (!parseSpecialModifications()) {
      return;
    }
    if (!name.trim()) { setError('Name is required'); return; }
    if (!hasTenant && !dueDate.trim()) {
      setError('Due date is required when assigning a tenant');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      };
      const hasRangeSelection = !!floorRanges.trim() && !!apartmentRanges.trim();

      if (!hasTenant && hasRangeSelection) {
        if (!propertyId) {
          throw new Error('Property context is missing for special modifications');
        }

        const parsedFloors = parseRange(floorRanges);
        const parsedApartments = parseRange(apartmentRanges);
        const floorNumbers = expandIntervals(parsedFloors);
        const apartmentNumbers = expandIntervals(parsedApartments);

        const propertyGrid = await userService.getPropertyApartmentsGrid(propertyId, { forceRefresh: true });
        const targetApartments: Array<{ floor: number; number: number; apartment: ApartmentGridResponse }> = [];

        floorNumbers.forEach((floorNumber) => {
          const floorMap = propertyGrid[floorNumber];
          if (!floorMap) return;
          apartmentNumbers.forEach((apartmentNumber) => {
            let target = floorMap[apartmentNumber];
            if (!target && apartmentNumber < 100) {
              target = floorMap[floorNumber * 100 + apartmentNumber];
            }
            if (!target && apartmentNumber >= 100) {
              const relativeNum = apartmentNumber % 100;
              target = floorMap[floorNumber * 100 + relativeNum];
            }
            if (target) {
              targetApartments.push({ floor: floorNumber, number: target.number, apartment: target });
            }
          });
        });

        if (targetApartments.length === 0) {
          setError('No apartments found for the selected floor/apartment ranges');
          return;
        }

        const occupiedTargets = targetApartments.filter(target => !!target.apartment.tenant);
        if (occupiedTargets.length > 0) {
          const occupiedLabel = occupiedTargets
            .slice(0, 8)
            .map(target => `F${target.floor}-APT${target.number}`)
            .join(', ');
          const suffix = occupiedTargets.length > 8 ? ', ...' : '';
          setError(`Cannot apply special modifications. Occupied apartments in selected range: ${occupiedLabel}${suffix}`);
          return;
        }

        for (const target of targetApartments) {
          await userService.assignTenant(target.apartment.id, payload);
          if (dueDate.trim() || !target.apartment.paymentStatus || target.apartment.paymentStatus !== 'PAID') {
            await userService.updateApartment(target.apartment.id, {
              dueDate: dueDate.trim() || undefined,
              paymentStatus: 'PAID',
            });
          }
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Multiple apartments changed; trigger parent fallback full refresh.
        onSuccess?.();
        return;
      }

      let savedTenant: TenantGridResponse;
      if (hasTenant) {
        savedTenant = await userService.updateTenant(apartment.id, payload);
      } else {
        savedTenant = await userService.assignTenant(apartment.id, payload);
      }
      if (dueDate.trim() || !apartment.paymentStatus || apartment.paymentStatus !== 'PAID') {
        await userService.updateApartment(apartment.id, {
          dueDate: dueDate.trim() || undefined,
          paymentStatus: 'PAID',
        });
      }
      setCurrentTenant(savedTenant);
      setShowAddForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSuccess?.({
        apartmentId: apartment.id,
        changes: {
          tenant: savedTenant,
          dueDate: dueDate.trim() ? dueDate : apartment.dueDate,
          paymentStatus: 'PAID',
        },
      });
    } catch (e: any) {
      setError(e.message || 'Error saving tenant');
    } finally {
      setSaving(false);
    }
  };

  const handleVacate = async () => {
    setVacating(true);
    try {
      await userService.vacateApartment(apartment.id);
      setCurrentTenant(null);
      setName('');
      setPhone('');
      setEmail('');
      setDueDate('');
      setShowAddForm(false);
      onSuccess?.({ apartmentId: apartment.id, changes: { tenant: null, dueDate: undefined } });
    } catch (e: any) {
      setError(e.message || 'Error vacating apartment');
    } finally {
      setVacating(false);
    }
  };

  const formVisible = hasTenant || showAddForm;

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {!hasTenant && !showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-xl font-bold text-sm bg-[#4ade80]/15 hover:bg-[#4ade80]/25 border border-[#4ade80]/40 text-[#4ade80] transition-colors"
        >
          + Add Tenant
        </button>
      )}

      {formVisible && (
        <>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Full Name *</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#4ade80] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
              placeholder="Tenant name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Phone</label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#4ade80] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
                placeholder="+54 11 ..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Email (optional)</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#4ade80] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
              Due Date <span className="text-white/35 normal-case">(date tenant enters / monthly anchor)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/10 focus:border-[#4ade80] rounded-xl text-white placeholder-white/30 transition-colors focus:outline-none"
            />
          </div>

          {/* Special modifications ─────────────────────────────────────── */}
          <div className="mt-2">
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/35">Special Modifications</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-xs text-white/40 mb-3">
              If this tenant rents a block of units (e.g. a company), define floors and apartments using parsed ranges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">Floors (Range)</label>
                <input
                  type="text"
                  value={floorRanges}
                  onChange={(e) => setFloorRanges(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="1-5, 9"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Apartments (Range)</label>
                <input
                  type="text"
                  value={apartmentRanges}
                  onChange={(e) => setApartmentRanges(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="1-4, 8, 10"
                />
              </div>
            </div>
            <p className="text-[11px] text-white/35 mt-2">Format example: `1-5, 9`</p>
            {specialModsError && (
              <p className="text-xs text-red-400 mt-2">{specialModsError}</p>
            )}
            {specialModsSummary && !specialModsError && (
              <p className="text-xs text-[#4ade80] mt-2">{specialModsSummary}</p>
            )}
          </div>

          <button
            type="button" onClick={handleSave} disabled={saving}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all mt-2 ${saved ? 'bg-green-500 text-white' : 'bg-[#4ade80] hover:bg-[#22c55e] text-black'} disabled:opacity-50`}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : hasTenant ? 'Save Tenant' : 'Assign Tenant'}
          </button>
        </>
      )}

      {hasTenant && (
        <div className="pt-2 border-t border-white/5 mt-2">
          <button
            type="button" onClick={() => setIsVacateDialogOpen(true)} disabled={vacating}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors disabled:opacity-50"
          >
            {vacating ? 'Processing…' : '🚪 Vacate Apartment'}
          </button>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={isVacateDialogOpen}
        title="Vacate apartment"
        description="Remove this tenant from the apartment? If the tenant has no other apartments, they will be deleted from the system."
        confirmText="Vacate"
        cancelText="Cancel"
        onClose={() => setIsVacateDialogOpen(false)}
        onConfirm={handleVacate}
      />
    </div>
  );
}

// ─── Sub-form: Expenses ──────────────────────────────────────────────────────

function ExpensesSection({
  apartment,
  onSuccess,
}: {
  apartment: ApartmentGridResponse;
  onSuccess: (changes: Partial<ApartmentGridResponse>) => void;
}) {
  const [expenses, setExpenses] = useState<ApartmentExpenseResponse[]>(apartment.expenses ?? []);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setError('Amount must be a positive number'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    setAdding(true);
    try {
      const created = await userService.addExpense(apartment.id, { amount: amt, description: description.trim() });
      const nextExpenses = [...expenses, created];
      setExpenses(nextExpenses);
      setAmount('');
      setDescription('');
      onSuccess({ expenses: nextExpenses });
    } catch (e: any) {
      setError(e.message || 'Error adding expense');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    setDeletingId(expenseId);
    try {
      await userService.deleteExpense(apartment.id, expenseId);
      const nextExpenses = expenses.filter(e => e.id !== expenseId);
      setExpenses(nextExpenses);
      onSuccess({ expenses: nextExpenses });
    } catch (e: any) {
      setError(e.message || 'Error deleting expense');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {/* Expense list */}
      {expenses.length === 0 ? (
        <p className="text-sm text-white/35 italic text-center py-3">No expenses for this apartment</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map(exp => (
            <li
              key={exp.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{exp.description}</p>
                <p className="text-xs text-[#f59e0b] font-bold">${exp.amount}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(exp.id)}
                disabled={deletingId === exp.id}
                className="ml-3 p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                title="Delete expense"
              >
                {deletingId === exp.id ? '…' : <TrashIcon />}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add expense form */}
      <div className="flex items-center gap-3 mt-4 mb-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white/35">Add Expense</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1">Amount ($)</label>
          <input
            type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#f59e0b] rounded-lg text-white text-sm placeholder-white/30 transition-colors focus:outline-none"
            placeholder="0.00"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-white/40 mb-1">Description</label>
          <input
            type="text" value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#f59e0b] rounded-lg text-white text-sm placeholder-white/30 transition-colors focus:outline-none"
            placeholder="e.g. Plumbing repair"
          />
        </div>
      </div>

      <button
        type="button" onClick={handleAdd} disabled={adding}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#f59e0b]/15 hover:bg-[#f59e0b]/25 border border-[#f59e0b]/40 text-[#f59e0b] transition-colors disabled:opacity-50"
      >
        {adding ? 'Adding…' : '+ Add Expense'}
      </button>
    </div>
  );
}

// ─── Main dialog ─────────────────────────────────────────────────────────────

export function EditApartmentTabsDialog({
  isOpen,
  propertyId,
  apartment,
  initialSection = null,
  onClose,
  onSuccess,
}: EditApartmentTabsDialogProps) {
  const [openSection, setOpenSection] = useState<'data' | 'tenant' | 'expenses' | null>(null);

  // Collapse all sections when the dialog opens (do not auto-expand the first accordion)
  useEffect(() => {
    if (isOpen) setOpenSection(initialSection);
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const toggle = (section: 'data' | 'tenant' | 'expenses') => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black text-2xl text-white" style={{ fontFamily: "'Chivo', sans-serif" }}>
              Edit Apartment
            </h2>
            <p className="text-sm text-white/50 mt-0.5">APT {apartment.number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Accordions */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <Accordion
            title="Apartment Data"
            open={openSection === 'data'}
            onToggle={() => toggle('data')}
            accentColor="#928dd3"
          >
            <ApartmentDataSection apartment={apartment} onSuccess={(changes) => onSuccess?.({ apartmentId: apartment.id, changes })} />
          </Accordion>

          <Accordion
            title="Tenant"
            open={openSection === 'tenant'}
            onToggle={() => toggle('tenant')}
            accentColor="#4ade80"
          >
            <TenantSection propertyId={propertyId} apartment={apartment} onSuccess={onSuccess} />
          </Accordion>

          <Accordion
            title="Expenses"
            open={openSection === 'expenses'}
            onToggle={() => toggle('expenses')}
            accentColor="#f59e0b"
          >
            <ExpensesSection apartment={apartment} onSuccess={(changes) => onSuccess?.({ apartmentId: apartment.id, changes })} />
          </Accordion>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 shrink-0">
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
