import { useEffect, useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import userService, {
  MaintenanceFeeResponse,
  ApartmentGridResponse,
  OwnerApartmentsGridResponse,
} from '../../services/userService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeeWithContext extends MaintenanceFeeResponse {
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
  GENERAL:   { color: '#928dd3', bg: 'rgba(146,141,211,0.12)', border: 'rgba(146,141,211,0.3)' },
  CLEANING:  { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)'  },
  SECURITY:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
  AMENITIES: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)'  },
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
      className="flex-1 min-w-[160px] rounded-2xl p-5 relative overflow-hidden"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
          style={{ color: style.color, background: `${style.color}22` }}
        >
          {summary.category}
        </span>
        <span className="text-white/40 text-xs">{summary.count} fee{summary.count !== 1 ? 's' : ''}</span>
      </div>
      <p className="font-black text-3xl text-white tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
        {formatCurrency(summary.total)}
      </p>
      <p className="text-xs font-semibold mt-1" style={{ color: style.color }}>
        {pct}% of total monthly
      </p>
    </div>
  );
}

function FeeRow({ fee, aptNumber }: { fee: FeeWithContext; aptNumber: number }) {
  const style = categoryStyle(fee.category);
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-white/8 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 flex-[1_0_0]">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
          style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
        >
          {fee.category}
        </span>
      </div>
      <div className="flex-[2_0_0]">
        <p className="text-sm text-white font-semibold">{fee.description}</p>
        <p className="text-xs text-white/40 mt-0.5">APT {aptNumber}</p>
      </div>
      <div className="flex-[1_0_0]">
        <p className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
          {formatCurrency(fee.amount)}<span className="text-white/40 text-xs font-normal">/mo</span>
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MaintenanceFees() {
  const { currentOwner } = useOwner();
  const [loading, setLoading] = useState(true);
  const [allFees, setAllFees] = useState<FeeWithContext[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!currentOwner?.id) return;

    const fetchFees = async () => {
      setLoading(true);
      try {
        const ownerGrid: OwnerApartmentsGridResponse = await userService.getOwnerApartmentsGrid(currentOwner.id, { forceRefresh: true });

        const fees: FeeWithContext[] = [];
        Object.entries(ownerGrid).forEach(([propertyId, floorMap]) => {
          Object.values(floorMap).forEach((aptMap) => {
            Object.values(aptMap as Record<number, ApartmentGridResponse>).forEach((apt) => {
              (apt.maintenanceFees ?? []).forEach((fee) => {
                fees.push({ ...fee, apartmentNumber: apt.number, propertyId });
              });
            });
          });
        });

        setAllFees(fees);
      } catch (err) {
        console.error('Failed to load maintenance fees', err);
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-black min-h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between py-6 px-12">
        <div>
          <h1 className="font-black text-4xl text-white tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
            Maintenance Fees
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Monthly recurring fees for {currentOwner?.name ?? ''}
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{ background: 'rgba(146,141,211,0.12)', border: '1px solid rgba(146,141,211,0.3)' }}
        >
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Total / month</p>
            <p className="font-black text-2xl text-white tracking-tight" style={{ fontFamily: "'Chivo', sans-serif" }}>
              {loading ? '—' : formatCurrency(grandTotal)}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-white/40 text-base">Loading fees…</p>
        </div>
      ) : allFees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-white/30 text-5xl">🔧</p>
          <p className="text-white/50 text-base">No maintenance fees assigned yet.</p>
          <p className="text-white/30 text-sm">Open an apartment's edit dialog → Maintenance Fees tab to assign fees.</p>
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
              {categories.map((cat) => {
                const style = cat === 'All' ? null : categoryStyle(cat);
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                    style={
                      isActive && style
                        ? { background: style.bg, color: style.color, border: `1px solid ${style.border}` }
                        : isActive
                        ? { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {cat === 'All' ? 'All Categories' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fee rows table */}
          <div className="mx-12 mb-12 rounded-2xl relative" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
            {/* Table header */}
            <div className="flex items-center py-3 px-6 border-b border-white/10">
              <p className="flex-[1_0_0] text-xs font-bold uppercase tracking-widest text-white/40">Category</p>
              <p className="flex-[2_0_0] text-xs font-bold uppercase tracking-widest text-white/40">Description / Apartment</p>
              <p className="flex-[1_0_0] text-xs font-bold uppercase tracking-widest text-white/40">Monthly Cost</p>
            </div>

            {displayedFees.length === 0 ? (
              <div className="py-12 text-center text-white/30 text-sm">No fees in this category.</div>
            ) : (
              displayedFees.map((fee) => (
                <FeeRow key={fee.id} fee={fee} aptNumber={fee.apartmentNumber} />
              ))
            )}

            {/* Footer total */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
              <p className="text-white/40 text-sm">
                {displayedFees.length} fee{displayedFees.length !== 1 ? 's' : ''} shown
              </p>
              <p className="font-bold text-white text-sm">
                Subtotal:{' '}
                <span className="text-[#928dd3] font-black">
                  {formatCurrency(displayedFees.reduce((s, f) => s + f.amount, 0))}
                </span>
                /mo
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}