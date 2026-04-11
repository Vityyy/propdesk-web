import svgPaths from "../../imports/svg-zayt9vop9f";

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

interface PaymentRowProps {
  tenant: string;
  property: string;
  amount: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

function PaymentRow({ tenant, property, amount, dueDate, status }: PaymentRowProps) {
  const statusColors = {
    paid: 'text-[#0DC44A]',
    pending: 'text-[#928dd3]',
    overdue: 'text-[#FF6B6B]'
  };

  const statusText = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue'
  };

  return (
    <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <div className="flex-[2_0_0]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {tenant}
        </p>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {property}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
          {amount}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {dueDate}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 w-fit">
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
          <div className="relative shrink-0 size-[6px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill={status === 'paid' ? '#0DC44A' : status === 'pending' ? '#928dd3' : '#FF6B6B'} r="3" />
            </svg>
          </div>
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] whitespace-nowrap ${statusColors[status]}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {statusText[status]}
          </p>
        </div>
      </div>
      <button className="hover:opacity-70 transition-opacity">
        <DotsHorizontal />
      </button>
    </div>
  );
}

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-black flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
            {title}
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] text-white tracking-[-0.34px]">
            {value}
          </p>
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[#928dd3]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Payments() {
  const payments: PaymentRowProps[] = [
    {
      tenant: "John Smith",
      property: "Sunset Apartments - Unit 101",
      amount: "$1,200",
      dueDate: "Mar 1, 2026",
      status: "paid"
    },
    {
      tenant: "Sarah Johnson",
      property: "Harbor View - Unit 205",
      amount: "$1,350",
      dueDate: "Mar 1, 2026",
      status: "paid"
    },
    {
      tenant: "Michael Chen",
      property: "Downtown Lofts - Unit 304",
      amount: "$1,800",
      dueDate: "Mar 1, 2026",
      status: "pending"
    },
    {
      tenant: "Emily Davis",
      property: "Parkside - Unit 112",
      amount: "$1,150",
      dueDate: "Feb 1, 2026",
      status: "overdue"
    },
    {
      tenant: "David Wilson",
      property: "Riverside Towers - Unit 501",
      amount: "$1,500",
      dueDate: "Mar 1, 2026",
      status: "paid"
    },
    {
      tenant: "Lisa Anderson",
      property: "Metro Plaza - Unit 203",
      amount: "$1,400",
      dueDate: "Mar 1, 2026",
      status: "pending"
    }
  ];

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
            Payments
          </p>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Record Payment
            </p>
          </button>
        </div>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Track and manage all tenant payments
        </p>
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <SummaryCard title="Total Collected" value="$120,000" subtitle="This month" />
        <SummaryCard title="Outstanding" value="$15,000" subtitle="3 pending payments" />
        <SummaryCard title="Overdue" value="$1,150" subtitle="1 payment" />
      </div>

      <div className="bg-black mx-[48px] mb-[48px] rounded-[16px] relative">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)]">
            <p className="flex-[2_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Tenant
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Amount
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Due Date
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Status
            </p>
            <div className="w-[24px]" />
          </div>
          {payments.map((payment, index) => (
            <PaymentRow key={index} {...payment} />
          ))}
        </div>
      </div>
    </div>
  );
}
