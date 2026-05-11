import { MoreHorizontal, PieChart, Plus, FileText, Download } from 'lucide-react';
import { imgTable } from "../../imports/svg-9p2x7";

function ReportCard({ title, description, lastGenerated }: { title: string; description: string; lastGenerated: string }) {
  return (
    <div className="glass-card flex-[1_0_0] min-w-[300px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group hover:border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full relative">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#928dd3]/10 rounded-lg group-hover:bg-[#928dd3]/20 transition-colors">
                <FileText size={20} className="text-[#928dd3]" />
              </div>
              <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-primary whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                {title}
              </p>
            </div>
            <button className="text-tertiary hover:text-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
            {description}
          </p>
          <div className="w-full pt-[8px] mt-auto">
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[12px] text-tertiary mb-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Last generated: {lastGenerated}
            </p>
            <button className="bg-white/[0.02] border border-white/[0.08] hover:border-[#928dd3]/40 content-stretch flex gap-2 items-center justify-center px-[16px] py-[10px] relative rounded-[8px] w-full hover:bg-[#928dd3]/10 transition-all duration-300 group/btn">
              <Download size={16} className="text-tertiary group-hover/btn:text-[#928dd3] transition-colors" />
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-secondary group-hover/btn:text-primary whitespace-nowrap transition-colors" style={{ fontVariationSettings: "'wdth' 100" }}>
                Generate Report
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceChart() {
  return (
    <div className="glass-card rounded-[16px] p-[24px] w-full relative hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="content-stretch flex items-center justify-between mb-[24px]">
        <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
          Revenue Performance
        </p>
        <button className="text-tertiary hover:text-secondary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="relative w-full h-[300px]">
        <img src={imgTable} alt="Revenue Chart" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="glass-card flex-[1_0_0] min-w-[200px] relative rounded-[16px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group hover:border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#928dd3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[16px]" />
      <div className="overflow-clip rounded-[inherit] size-full relative">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
            {label}
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[28px] text-primary tracking-[-0.24px] my-1">
            {value}
          </p>
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] px-2 py-1 rounded-md ${isPositive ? 'text-[#0DC44A] bg-[#0DC44A]/10' : 'text-[#ff6b6b] bg-[#ff6b6b]/10'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const reports = [
    {
      title: "Monthly Financial Report",
      description: "Comprehensive overview of income, expenses, and net profit",
      lastGenerated: "Mar 1, 2026"
    },
    {
      title: "Occupancy Report",
      description: "Detailed analysis of property occupancy rates and trends",
      lastGenerated: "Mar 15, 2026"
    },
    {
      title: "Maintenance Report",
      description: "Summary of maintenance activities and costs",
      lastGenerated: "Mar 10, 2026"
    },
    {
      title: "Tax Summary",
      description: "Annual tax information and documentation",
      lastGenerated: "Feb 28, 2026"
    },
    {
      title: "Tenant Payment History",
      description: "Complete payment records for all tenants",
      lastGenerated: "Mar 18, 2026"
    },
    {
      title: "Property Performance",
      description: "Comparative analysis of property performance metrics",
      lastGenerated: "Mar 12, 2026"
    }
  ];

  return (
    <div className="min-h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#928dd3]/3 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-12 relative">
        <div>
          <h1 className="font-black text-4xl text-primary tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <PieChart className="text-[#928dd3]" size={36} />
            Reports
          </h1>
          <p className="text-primary/40 text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Generate and analyze comprehensive property management reports
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#928dd3] to-[#a89be6] content-stretch flex gap-2 items-center justify-center px-[16px] py-[8px] relative rounded-[10px] shrink-0 hover:opacity-100 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] ring-1 ring-white/20 hover:ring-white/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
          <Plus size={18} className="text-black" />
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Custom Report
          </p>
        </button>
      </div>

      <div className="content-stretch flex gap-[16px] items-start px-[48px] pb-[24px] relative w-full flex-wrap">
        <MetricCard label="Total Revenue YTD" value="$360,000" change="+12% vs last year" />
        <MetricCard label="Total Expenses YTD" value="$95,000" change="+5% vs last year" />
        <MetricCard label="Net Profit YTD" value="$265,000" change="+15% vs last year" />
        <MetricCard label="Avg Occupancy" value="91%" change="+3% vs last year" />
      </div>

      <div className="px-[48px] pb-[24px]">
        <PerformanceChart />
      </div>

      <div className="px-[48px] pb-[48px]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] mb-[16px] text-[24px] text-secondary tracking-[-0.24px]">
          Available Reports
        </p>
        <div className="content-stretch flex flex-wrap gap-[24px] items-start w-full">
          {reports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
}
