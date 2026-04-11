import svgPaths from "../../imports/svg-zayt9vop9f";
import { imgTable } from "../../imports/svg-9p2x7";

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

function ReportCard({ title, description, lastGenerated }: { title: string; description: string; lastGenerated: string }) {
  return (
    <div className="bg-black flex-[1_0_0] min-w-[300px] relative rounded-[16px]">
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
          <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {description}
          </p>
          <div className="w-full pt-[8px]">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Last generated: {lastGenerated}
            </p>
            <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] w-full hover:bg-[#7f7ab8] transition-colors">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Generate Report
              </p>
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function PerformanceChart() {
  return (
    <div className="bg-black rounded-[16px] p-[24px] w-full relative">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex items-center justify-between mb-[24px]">
        <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          Revenue Performance
        </p>
        <button className="hover:opacity-70 transition-opacity">
          <DotsHorizontal />
        </button>
      </div>
      <div className="relative w-full h-[300px]">
        <img src={imgTable} alt="Revenue Chart" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="bg-black flex-[1_0_0] min-w-[150px] relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {label}
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
            {value}
          </p>
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[#928dd3]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {change}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
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
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
            Reports
          </p>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Custom Report
            </p>
          </button>
        </div>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Generate and analyze comprehensive property management reports
        </p>
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
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] mb-[16px] text-[24px] text-white tracking-[-0.24px]">
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
