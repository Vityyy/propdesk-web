import { useOwner } from '../context/OwnerContext';
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

function RevenueChart() {
  return (
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
            <button className="hover:opacity-70 transition-opacity">
              <DotsHorizontal />
            </button>
          </div>
          <div className="relative w-full h-[300px]">
            <img src={imgTable} alt="Revenue Chart" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-[24px] w-full">
            <div className="flex items-center gap-[8px]">
              <div className="w-[12px] h-[12px] rounded-[2px] bg-[#928dd3]" />
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Total Revenue
              </p>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="w-[12px] h-[12px] rounded-[2px] bg-[#0DC44A]" />
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Net Profit (Owner)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Summary() {
  const { currentOwner } = useOwner();

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Summary
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Financial overview for {currentOwner.name}
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
          value="$105,000" 
          subtitle="+8.5% from last month"
          trend="Mar 2026"
        />
        <MetricCard 
          title="Unpaid Tenants" 
          value="12%" 
          subtitle="3 of 25 tenants"
          trend="Due: $4,200"
        />
        <MetricCard 
          title="Total Expense Payments" 
          value="$28,400" 
          subtitle="+3.2% from last month"
          trend="Mar 2026"
        />
      </div>

      <div className="px-[48px] pb-[48px]">
        <RevenueChart />
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
                  $105,000
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
          </div>
          
          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Total Expenses
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  $28,400
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
          </div>

          <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Admin Commission (10%)
                </p>
                <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
                  $10,500
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
                  $66,100
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
