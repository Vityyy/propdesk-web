import { useEffect, useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { summaryService, SummaryResponse } from '../../services/summaryService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MoreHorizontal, Download, LineChart as LineChartIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Removing hardcoded DotsHorizontal, using MoreHorizontal from lucide-react directly in the component

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
}

function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  return (
    <div className="glass-card flex-[1_0_0] min-w-[250px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group hover:border-white/[0.1]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full relative">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full h-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white/80 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              {title}
            </p>
            <button className="text-white/30 hover:text-white/70 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">{value}</p>
            {subtitle && (
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                {subtitle}
              </p>
            )}
            {trend && (
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-white/50 text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.15] transition-colors inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Summary() {
  const { currentOwner } = useOwner();
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!currentOwner) return;
      try {
        setLoading(true);
        const data = await summaryService.getSummary(currentOwner.id);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [currentOwner]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  if (loading || !summary) {
    return (
      <div className="bg-black min-h-full w-full flex items-center justify-center">
        <LoadingSpinner label="Loading Summary..." size="lg" />
      </div>
    );
  }

  const unpaidPercentage = summary.totalTenantsCount > 0 
    ? Math.round((summary.unpaidTenantsCount / summary.totalTenantsCount) * 100) 
    : 0;

  const chartData = [...summary.historicalData];

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-12 relative">
        <div>
          <h1 className="font-black text-4xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <LineChartIcon className="text-[#928dd3]" size={36} />
            Summary
          </h1>
          <p className="text-white/40 text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Financial overview for {currentOwner?.name}
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#928dd3] to-[#a89be6] content-stretch flex gap-2 items-center justify-center px-[16px] py-[8px] relative rounded-[10px] shrink-0 hover:opacity-100 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] ring-1 ring-white/20 hover:ring-white/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
          <Download size={18} className="text-black" />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Export Report
          </p>
        </button>
      </div>

      <div className="content-stretch flex gap-[24px] items-stretch px-[48px] pb-[24px] relative w-full flex-wrap">
        <MetricCard 
          title="Total Collected This Month" 
          value={formatCurrency(summary.monthlyBreakdown.grossRevenue - summary.monthlyBreakdown.totalExpenses)}
          subtitle={`Gross: ${formatCurrency(summary.monthlyBreakdown.grossRevenue)} — Expenses: ${formatCurrency(summary.monthlyBreakdown.totalExpenses)}`}
        />
        <MetricCard 
          title="Unpaid Apartments"
          value={`${unpaidPercentage}%`} 
          subtitle={`${summary.unpaidTenantsCount} of ${summary.totalTenantsCount} apartments`}
          trend={`Due: ${formatCurrency(summary.unpaidAmount)}`}
        />
        <MetricCard 
          title="Expenses & Maintenance Fees" 
          value={formatCurrency(summary.totalExpensesThisMonth)} 
          subtitle={summary.expensesTrend}
        />
      </div>

      <div className="px-[48px] pb-[48px]">
        <div className="glass-card flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
          <div className="overflow-clip rounded-[inherit] size-full relative">
            <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div>
                  <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] relative shrink-0 text-[17px] text-white/80 whitespace-nowrap mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Total Revenue vs Net Profit
                  </p>
                  <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-white/50" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Monthly comparison over time
                  </p>
                </div>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(3,3,8,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [formatCurrency(value as number), '']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" name="Total Revenue" dataKey="revenue" stroke="#928dd3" strokeWidth={3} dot={{ r: 4, fill: '#928dd3' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Net Profit (Owner)" dataKey="profit" stroke="#0DC44A" strokeWidth={3} dot={{ r: 4, fill: '#0DC44A' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.12] transition-colors inset-0 pointer-events-none rounded-[16px]" />
        </div>
      </div>

      <div className="px-[48px] pb-[48px]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] mb-[16px] text-[24px] text-white/80 tracking-[-0.24px]">
          Monthly Breakdown
        </p>
        <div className="flex gap-[24px] flex-wrap">
          <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
            <div className="overflow-clip rounded-[inherit] size-full relative">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white/50" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Gross Revenue
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.grossRevenue)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.12] transition-colors inset-0 pointer-events-none rounded-[16px]" />
          </div>
          
          <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
            <div className="overflow-clip rounded-[inherit] size-full relative">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white/50" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Expenses & Fees
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.totalExpenses)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.12] transition-colors inset-0 pointer-events-none rounded-[16px]" />
          </div>

          <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
            <div className="overflow-clip rounded-[inherit] size-full relative">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white/50" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Admin Commission {summary.monthlyBreakdown.grossRevenue > 0 ? `(${Math.round((summary.monthlyBreakdown.adminCommission / summary.monthlyBreakdown.grossRevenue) * 100)}%)` : ''}
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.adminCommission)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-white/[0.06] group-hover:border-white/[0.12] transition-colors inset-0 pointer-events-none rounded-[16px]" />
          </div>

          <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(13,196,74,0.15)] transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0DC44A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
            <div className="overflow-clip rounded-[inherit] size-full relative">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[#0DC44A]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Net Profit (Owner)
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-[#0DC44A] tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.netProfit)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#0DC44A]/30 group-hover:border-[#0DC44A] transition-colors inset-0 pointer-events-none rounded-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
