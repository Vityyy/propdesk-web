import { useEffect, useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { summaryService, SummaryResponse } from '../../services/summaryService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import svgPaths from "../../imports/svg-zayt9vop9f";
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

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
}

function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  return (
    <div className="bg-black flex-[1_0_0] min-w-[250px] relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              {title}
            </p>
            <button className="hover:opacity-70 transition-opacity">
              <DotsHorizontal />
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
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[rgba(255,255,255,0.6)] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
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
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Summary
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Financial overview for {currentOwner?.name}
            </p>
          </div>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Export Report
            </p>
          </button>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full flex-wrap">
        <MetricCard 
          title="Total Collected This Month" 
          value={formatCurrency(summary.monthlyBreakdown.grossRevenue - summary.monthlyBreakdown.totalExpenses)}
          subtitle={`Gross: ${formatCurrency(summary.monthlyBreakdown.grossRevenue)} — Expenses: ${formatCurrency(summary.monthlyBreakdown.totalExpenses)}`}
        />
        <MetricCard 
          title="Unpaid Tenants" 
          value={`${unpaidPercentage}%`} 
          subtitle={`${summary.unpaidTenantsCount} of ${summary.totalTenantsCount} tenants`}
          trend={`Due: ${formatCurrency(summary.unpaidAmount)}`}
        />
        <MetricCard 
          title="Expenses & Maintenance Fees" 
          value={formatCurrency(summary.totalExpensesThisMonth)} 
          subtitle={summary.expensesTrend}
        />
      </div>

      <div className="px-[48px] pb-[48px]">
        <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div>
                  <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] relative shrink-0 text-[17px] text-white whitespace-nowrap mb-[4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Total Revenue vs Net Profit
                  </p>
                  <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Monthly comparison over time
                  </p>
                </div>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
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
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        </div>
      </div>

      <div className="px-[48px] pb-[48px]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] mb-[16px] text-[24px] text-white tracking-[-0.24px]">
          Monthly Breakdown
        </p>
        <div className="flex gap-[24px] flex-wrap">
          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Gross Revenue
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.grossRevenue)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
          </div>
          
          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Expenses & Fees
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.totalExpenses)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
          </div>

          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Admin Commission {summary.monthlyBreakdown.grossRevenue > 0 ? `(${Math.round((summary.monthlyBreakdown.adminCommission / summary.monthlyBreakdown.grossRevenue) * 100)}%)` : ''}
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.adminCommission)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
          </div>

          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[#0DC44A]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Net Profit (Owner)
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-[#0DC44A] tracking-[-0.24px]">
                  {formatCurrency(summary.monthlyBreakdown.netProfit)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-[#0DC44A] inset-0 pointer-events-none rounded-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
