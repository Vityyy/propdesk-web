import { useState } from 'react';
import { imgTable } from "../../imports/svg-9p2x7";
import svgPaths from "../../imports/svg-zayt9vop9f";
import imgImageUserAvatar from "figma:asset/7fd7b2055bb2f556381513a55b6951492f6e47d0.png";

function CaretDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="caret-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p9005000} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TitleContainer() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title Container">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">Property Management Dashboard</p>
      <button className="hover:opacity-70 transition-opacity">
        <CaretDown />
      </button>
    </div>
  );
}

function ProjectStatus() {
  return (
    <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="projectStatus">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[6px]" data-name="Status Dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #0DC44A)" id="Status Dot" r="3" />
        </svg>
      </div>
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] overflow-hidden relative shrink-0 text-[15px] text-center text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Operational
      </p>
    </div>
  );
}

function TitleAndStatusContainer() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Title and Status Container">
      <TitleContainer />
      <ProjectStatus />
    </div>
  );
}

function ButtonFilledStandard() {
  return (
    <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors" data-name="buttonFilledStandard">
      <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Share
      </p>
    </button>
  );
}

function DotsHorizontal() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="dots-horizontal">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="dots-horizontal">
          <path clipRule="evenodd" d={svgPaths.p3d5ea200} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function IconButtonOutlinedStandard() {
  return (
    <button className="bg-black content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0 hover:bg-[rgba(255,255,255,0.05)] transition-colors" data-name="iconButtonOutlinedStandard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.16)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]">
        <DotsHorizontal />
      </div>
    </button>
  );
}

function ActionsContainer() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Actions Container">
      <ButtonFilledStandard />
      <IconButtonOutlinedStandard />
    </div>
  );
}

function HeaderFrame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Header Frame">
      <TitleAndStatusContainer />
      <ActionsContainer />
    </div>
  );
}

function ImageUserAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none rounded-[999px] ${className}`} data-name="Image (user avatar)">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[999px] size-full" src={imgImageUserAvatar} />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 rounded-[999px]" />
    </div>
  );
}

function ProfilePictures() {
  return (
    <div className="content-stretch flex isolate items-start pr-[6px] relative shrink-0" data-name="Profile pictures">
      {[4, 3, 2, 1].map((zIndex) => (
        <div key={zIndex} className="mr-[-6px] relative rounded-[999px] shrink-0 size-[32px]" style={{ zIndex }} data-name="profile">
          <div className="overflow-clip relative rounded-[inherit] size-full">
            <ImageUserAvatar />
          </div>
          <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[1001px]" />
        </div>
      ))}
    </div>
  );
}

function TextContainer() {
  return (
    <div className="content-stretch flex font-['Archivo:Medium',sans-serif] font-medium gap-[4px] items-center leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" data-name="Text container">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Alexandra, Benjamin, Charlotte
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        +12 others
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <ProfilePictures />
      <TextContainer />
    </div>
  );
}

type TabType = 'overview' | 'payments' | 'expenses' | 'reports';

interface TabItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ label, isActive, onClick }: TabItemProps) {
  return (
    <button 
      onClick={onClick}
      className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
    >
      {isActive && (
        <div aria-hidden="true" className="absolute border-[#928dd3] border-b border-solid inset-0 pointer-events-none" />
      )}
      <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] whitespace-nowrap ${isActive ? 'text-[#928dd3]' : 'text-[rgba(255,255,255,0.6)]'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
        {label}
      </p>
    </button>
  );
}

function DashboardTabs({ activeTab, setActiveTab }: { activeTab: TabType; setActiveTab: (tab: TabType) => void }) {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="dashboard tabs">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.16)] border-b border-solid inset-0 pointer-events-none" />
      <TabItem label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
      <TabItem label="Payments" isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
      <TabItem label="Expenses" isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
      <TabItem label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
    </div>
  );
}

function DashboardTitle({ activeTab, setActiveTab }: { activeTab: TabType; setActiveTab: (tab: TabType) => void }) {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[24px] items-start overflow-clip py-[24px] px-[48px] relative shrink-0 w-full z-[3]" data-name="dashboard title">
      <HeaderFrame />
      <Container2 />
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function DotsHorizontal1() {
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

interface NumberCardProps {
  title: string;
  value: string;
  change: string;
}

function NumberCard({ title, value, change }: NumberCardProps) {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="numberCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] min-h-px min-w-px overflow-hidden relative text-[17px] text-ellipsis text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              {title}
            </p>
            <button className="hover:opacity-70 transition-opacity">
              <DotsHorizontal1 />
            </button>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] overflow-hidden relative shrink-0 text-[34px] text-ellipsis text-white tracking-[-0.34px] w-full whitespace-nowrap">{value}</p>
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              {change}
            </p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function KeyMetrics() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Key Metrics">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] relative shrink-0 text-[24px] text-white tracking-[-0.24px] whitespace-nowrap">Key Metrics</p>
      <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
        <NumberCard title="Card title" value="12.4k" change="+10.7% last mo" />
        <NumberCard title="Outstanding Payments" value="$15,000" change="-3%" />
        <NumberCard title="Monthly Expenses" value="$30,000" change="+2%" />
        <NumberCard title="Admin Commission" value="$5,000" change="+2%" />
      </div>
    </div>
  );
}

function RentCollectedChart() {
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] relative shrink-0 text-[17px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Rent Collected
            </p>
            <button className="hover:opacity-70 transition-opacity">
              <DotsHorizontal1 />
            </button>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">$120,000</p>
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#928dd3] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              +6%
            </p>
          </div>
          <div className="relative w-full h-[200px]">
            <img src={imgTable} alt="Chart" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function ExpenseBreakdown() {
  const expenses = ['Utilities', 'Maintenance', 'Insurance', 'Taxes', 'Other'];
  
  return (
    <div className="bg-black flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] relative shrink-0 text-[17px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Expense Breakdown
            </p>
            <button className="hover:opacity-70 transition-opacity">
              <DotsHorizontal1 />
            </button>
          </div>
          <button className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.16)] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Expense Type
            </p>
            <CaretDown />
          </button>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            {expenses.map((expense, index) => (
              <button 
                key={index}
                className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full hover:bg-[rgba(255,255,255,0.03)] transition-colors rounded-[4px] px-[8px]"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {expense}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function FinancialOverview() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] relative shrink-0 text-[24px] text-white tracking-[-0.24px] whitespace-nowrap">Financial Overview</p>
      <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
        <RentCollectedChart />
        <ExpenseBreakdown />
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      <KeyMetrics />
      <FinancialOverview />
    </>
  );
}

function PaymentsTab() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] relative shrink-0 text-[24px] text-white tracking-[-0.24px] whitespace-nowrap">Payment Details</p>
      <div className="bg-black rounded-[16px] p-[24px] w-full">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <p className="text-white text-[15px]">Payment information will be displayed here.</p>
      </div>
    </div>
  );
}

function ExpensesTab() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] relative shrink-0 text-[24px] text-white tracking-[-0.24px] whitespace-nowrap">Expense Details</p>
      <div className="bg-black rounded-[16px] p-[24px] w-full">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <p className="text-white text-[15px]">Expense information will be displayed here.</p>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] relative shrink-0 text-[24px] text-white tracking-[-0.24px] whitespace-nowrap">Reports</p>
      <div className="bg-black rounded-[16px] p-[24px] w-full">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <p className="text-white text-[15px]">Reports will be displayed here.</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="bg-black min-h-full w-full">
      <DashboardTitle activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-stretch flex flex-col gap-[48px] items-start px-[48px] py-[24px] relative w-full">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
