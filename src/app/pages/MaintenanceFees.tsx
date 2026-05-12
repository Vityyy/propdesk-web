import { useEffect, useState } from 'react';
import { Trash2, Wrench } from 'lucide-react';
import { useOwner } from '../context/OwnerContext';
import userService, {
  MaintenanceFeeResponse,
  ApartmentGridResponse,
  OwnerApartmentsGridResponse,
} from '../../services/userService';
import { getMockOwnerGrid, isMockEnabled } from "../../utils/mockApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeeWithContext extends MaintenanceFeeResponse {
  apartmentId: string;
  apartmentNumber: number;
  propertyId: string;
}

interface CategorySummary {
  category: string;
  total: number;
  count: number;
  fees: FeeWithContext[];
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  GENERAL: { color: '#928dd3', bg: 'rgba(146,141,211,0.12)', border: 'rgba(146,141,211,0.3)' },
  CLEANING: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)' },
  SECURITY: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  AMENITIES: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
};

function categoryStyle(cat: string) {
  return CATEGORY_CONFIG[cat.toUpperCase()] ?? { color: '#ffffff', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)' };
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ summary, total }: { summary: CategorySummary; total: number }) {
  const style = categoryStyle(summary.category);
  const pct = total > 0 ? Math.round((summary.total / total) * 100) : 0;

  return (
    <div
      className="flex-1 min-w-[160px] rounded-[16px] p-6 relative overflow-hidden backdrop-blur-sm shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{ background: style.bg, border: `1px solid ${style.border}`, boxShadow: `0 8px 30px ${style.bg.replace('0.12', '0.05')}` }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: style.color }} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <span
          className="px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider"
          style={{ color: style.color, background: `${style.color}22` }}
        >
          {summary.category}
        </span>
        <span className="text-tertiary text-xs font-['Archivo:Medium',sans-serif]">{summary.count} fee{summary.count !== 1 ? 's' : ''}</span>
      </div>
      <div className="relative z-10">
        <p className="font-black text-[32px] leading-tight text-primary tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
          {formatCurrency(summary.total)}
        </p>
        <p className="text-xs font-semibold mt-1" style={{ color: style.color }}>
          {pct}% of total monthly
        </p>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function FeeRow({
  fee,
  aptNumber,
  deleting,
  onDelete,
}: {
  fee: FeeWithContext;
  aptNumber: number;
  deleting: boolean;
  onDelete: (fee: FeeWithContext) => void;
}) {
  const style = categoryStyle(fee.category);
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center gap-3 flex-[1_0_0]">
        <span
          className="px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider"
          style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
        >
          {fee.category}
        </span>
      </div>
      <div className="flex-[2_0_0]">
        <p className="text-sm text-primary font-['Archivo:SemiBold',sans-serif] font-semibold">{fee.description}</p>
        <p className="text-xs text-tertiary mt-1 font-['Archivo:Medium',sans-serif]">APT {aptNumber}</p>
      </div>
      <div className="flex-[1_0_0]">
        <p className="text-lg font-black text-primary tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
          {formatCurrency(fee.amount)}<span className="text-tertiary text-xs font-['Archivo:Medium',sans-serif] ml-1 font-normal">/mo</span>
        </p>
      </div>
      <div className="w-20 flex justify-end">
        <button
          type="button"
          onClick={() => onDelete(fee)}
          disabled={deleting}
          className="p-2 rounded-[8px] text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.12)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Delete maintenance fee"
        >
          {deleting ? (
            <span className="text-xs font-bold">...</span>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryCardSkeleton() {
  return (
    <div className="flex-1 min-w-[160px] rounded-[16px] p-6 relative overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-20 rounded-[6px] bg-white/10 animate-pulse" />
        <div className="h-4 w-14 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="h-9 w-32 rounded bg-white/10 animate-pulse" />
      <div className="h-2 mt-4 rounded-full bg-white/5 animate-pulse w-full" />
    </div>
  );
}

function FeeRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-white/5">
      <div className="flex items-center gap-3 flex-[1_0_0]">
        <div className="h-5 w-20 rounded-[6px] bg-white/10 animate-pulse" />
      </div>
      <div className="flex-[2_0_0]">
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-24 rounded bg-white/5 mt-2 animate-pulse" />
      </div>
      <div className="flex-[1_0_0]">
        <div className="h-5 w-28 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="w-20" />
    </div>
  );
}

function HeaderSummarySkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-[16px] min-w-[220px] bg-white/[0.02] border border-white/5 backdrop-blur-md">
      <div className="w-full">
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
        <div className="h-8 w-32 mt-2 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

function CategoryFilterButton({ cat, isActive, onClick }: { cat: string; isActive: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const style = cat === 'All' ? null : categoryStyle(cat);

  const getStyle = () => {
    if (isActive) {
      if (style) {
        return { background: style.bg, color: style.color, borderColor: style.border, boxShadow: `0 0 15px ${style.bg}` };
      }
      return { background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' };
    }
    
    if (isHovered) {
      if (style) {
        return { background: style.bg, color: style.color, borderColor: style.border };
      }
      return { background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' };
    }

    return { background: 'transparent', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' };
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isActive && !style ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}
      style={getStyle()}
    >
      {cat === 'All' ? 'All Categories' : cat.charAt(0) + cat.slice(1).toLowerCase()}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MaintenanceFees() {
  const { currentOwner } = useOwner();
  const [loading, setLoading] = useState(true);
  const [allFees, setAllFees] = useState<FeeWithContext[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingFeeId, setDeletingFeeId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const buildFeesFromGrid = (ownerGrid: OwnerApartmentsGridResponse): FeeWithContext[] => {
    const fees: FeeWithContext[] = [];
    Object.entries(ownerGrid).forEach(([propertyId, floorMap]) => {
      Object.values(floorMap).forEach((aptMap) => {
        Object.values(aptMap as Record<number, ApartmentGridResponse>).forEach((apt) => {
          (apt.maintenanceFees ?? []).forEach((fee) => {
            fees.push({ ...fee, apartmentId: apt.id, apartmentNumber: apt.number, propertyId });
          });
        });
      });
    });

    return fees;
  };

  useEffect(() => {
    if (!currentOwner?.id) return;

    const fetchFees = async () => {
      setLoading(true);
      const mockEnabled = isMockEnabled();
      try {
        let ownerGrid: OwnerApartmentsGridResponse = await userService.getOwnerApartmentsGrid(currentOwner.id, { forceRefresh: true });
        if (Object.keys(ownerGrid).length === 0 && mockEnabled) {
          ownerGrid = getMockOwnerGrid();
        }

        setAllFees(buildFeesFromGrid(ownerGrid));
      } catch (err) {
        console.error('Failed to load maintenance fees', err);
        if (mockEnabled) {
          setAllFees(buildFeesFromGrid(getMockOwnerGrid()));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [currentOwner?.id]);

  // ─── Derived data ──────────────────────────────────────────────────────────

  const categorySummaries: CategorySummary[] = Object.values(
    allFees.reduce<Record<string, CategorySummary>>((acc, fee) => {
      const cat = fee.category.toUpperCase();
      if (!acc[cat]) acc[cat] = { category: cat, total: 0, count: 0, fees: [] };
      acc[cat].total += fee.amount;
      acc[cat].count += 1;
      acc[cat].fees.push(fee);
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const grandTotal = allFees.reduce((s, f) => s + f.amount, 0);
  const categories = ['All', ...categorySummaries.map((s) => s.category)];

  const displayedFees =
    selectedCategory === 'All'
      ? allFees
      : allFees.filter((f) => f.category.toUpperCase() === selectedCategory);

  const handleDeleteFee = async (fee: FeeWithContext) => {
    setDeleteError(null);
    setDeletingFeeId(fee.id);

    try {
      await userService.deleteMaintenanceFee(fee.apartmentId, fee.id);
      setAllFees(currentFees => currentFees.filter(currentFee => currentFee.id !== fee.id));
      userService.invalidatePropertyApartmentsGrid(fee.propertyId);
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete maintenance fee');
    } finally {
      setDeletingFeeId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-12 relative">
        <div>
          <h1 className="font-black text-4xl text-primary tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <Wrench className="text-[#928dd3]" size={36} />
            Maintenance Fees
          </h1>
          <p className="text-tertiary text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Monthly recurring fees for {currentOwner?.name ?? ''}
          </p>
        </div>
        {loading ? (
          <HeaderSummarySkeleton />
        ) : (
          <div className="flex items-center gap-3 px-6 py-4 rounded-[16px] glass-card border border-white/[0.06] shadow-lg backdrop-blur-md hover:border-[#928dd3]/30 transition-colors">
            <div>
              <p className="text-[#928dd3] text-[11px] font-bold uppercase tracking-widest mb-1">Total / month</p>
              <p className="font-black text-3xl text-primary tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <>
          <div className="flex gap-4 px-12 pb-6 flex-wrap">
            <SummaryCardSkeleton />
          </div>

          <div className="px-12 pb-4">
            <div className="flex gap-2 flex-wrap">
              <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
              <div className="h-8 w-24 rounded-full bg-white/5 animate-pulse" />
              <div className="h-8 w-24 rounded-full bg-white/5 animate-pulse" />
              <div className="h-8 w-28 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>

          <div className="mx-12 mb-12 rounded-[16px] bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-lg overflow-hidden">
            <div className="flex items-center py-4 px-6 border-b border-white/10 bg-white/[0.02]">
              <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
              <div className="flex-[2_0_0]" />
              <div className="h-3 w-28 rounded bg-white/10 animate-pulse" />
              <div className="w-20" />
            </div>

            <FeeRowSkeleton />

            <div className="flex items-center justify-between px-6 py-5 border-t border-white/10 bg-white/[0.02]">
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </>
      ) : allFees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-2">
            <Wrench className="text-primary/20" size={40} />
          </div>
          <p className="text-tertiary text-lg font-['Archivo:SemiBold',sans-serif]">No maintenance fees assigned yet.</p>
          <p className="text-tertiary text-sm max-w-md text-center">Open an apartment's edit dialog and navigate to the Maintenance Fees tab to assign recurring fees.</p>
        </div>
      ) : (
        <>
          {/* Category summary cards */}
          <div className="flex gap-4 px-12 pb-6 flex-wrap">
            {categorySummaries.map((s) => (
              <SummaryCard key={s.category} summary={s} total={grandTotal} />
            ))}
          </div>

          {/* Category filter */}
          <div className="px-12 pb-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <CategoryFilterButton
                  key={cat}
                  cat={cat}
                  isActive={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </div>
          </div>

          {/* Fee rows table */}
          <div className="mx-12 mb-12 rounded-[16px] glass-card border border-white/[0.06] backdrop-blur-md shadow-lg overflow-hidden">
            {deleteError && (
              <div className="mx-6 mt-4 p-3 bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-[12px] text-[#ff6b6b] text-sm">
                {deleteError}
              </div>
            )}

            {/* Table header */}
            <div className="flex items-center py-4 px-6 border-b border-white/[0.06] bg-white/[0.02]">
              <p className="flex-[1_0_0] text-[11px] font-bold uppercase tracking-widest text-tertiary">Category</p>
              <p className="flex-[2_0_0] text-[11px] font-bold uppercase tracking-widest text-tertiary">Description / Apartment</p>
              <p className="flex-[1_0_0] text-[11px] font-bold uppercase tracking-widest text-tertiary">Monthly Cost</p>
              <p className="w-20 text-right text-[11px] font-bold uppercase tracking-widest text-tertiary">Actions</p>
            </div>

            {displayedFees.length === 0 ? (
              <div className="py-16 text-center text-tertiary text-sm">No fees in this category.</div>
            ) : (
              displayedFees.map((fee) => (
                <FeeRow
                  key={fee.id}
                  fee={fee}
                  aptNumber={fee.apartmentNumber}
                  deleting={deletingFeeId === fee.id}
                  onDelete={handleDeleteFee}
                />
              ))
            )}

            {/* Footer total */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-white/[0.06] bg-white/[0.02]">
              <p className="text-tertiary text-sm font-['Archivo:Medium',sans-serif]">
                {displayedFees.length} fee{displayedFees.length !== 1 ? 's' : ''} shown
              </p>
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-primary/90 text-sm">
                Subtotal:{' '}
                <span className="text-[#928dd3] font-black text-lg ml-2" style={{ fontFamily: "'Chivo', sans-serif" }}>
                  {formatCurrency(displayedFees.reduce((s, f) => s + f.amount, 0))}
                </span>
                <span className="text-tertiary text-xs font-normal ml-1">/mo</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
