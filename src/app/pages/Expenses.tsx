import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
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

interface ExpenseRowProps {
  category: string;
  description: string;
  property: string;
  amount: string;
  date: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

function ExpenseRow({ category, description, property, amount, date, paymentStatus }: ExpenseRowProps) {
  const categoryColors: Record<string, string> = {
    'Utilities': 'text-[#FFB84D]',
    'Maintenance': 'text-[#928dd3]',
    'Insurance': 'text-[#4D9FFF]',
    'Taxes': 'text-[#FF6B6B]',
    'Other': 'text-[#0DC44A]'
  };

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
      <div className="flex-[1_0_0]">
        <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 w-fit">
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] whitespace-nowrap ${categoryColors[category] || 'text-white'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {category}
          </p>
        </div>
      </div>
      <div className="flex-[2_0_0]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {description}
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
          {date}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <div className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 w-fit">
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
          <div className="relative shrink-0 size-[6px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill={paymentStatus === 'paid' ? '#0DC44A' : paymentStatus === 'pending' ? '#928dd3' : '#FF6B6B'} r="3" />
            </svg>
          </div>
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] whitespace-nowrap ${statusColors[paymentStatus]}`} style={{ fontVariationSettings: "'wdth' 100" }}>
            {statusText[paymentStatus]}
          </p>
        </div>
      </div>
      <button className="hover:opacity-70 transition-opacity">
        <DotsHorizontal />
      </button>
    </div>
  );
}

function CategoryCard({ category, amount, percentage }: { category: string; amount: string; percentage: string }) {
  return (
    <div className="bg-black flex-[1_0_0] min-w-[150px] relative rounded-[16px]">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {category}
          </p>
          <p className="font-['Chivo:Black',sans-serif] font-black leading-[32px] text-[24px] text-white tracking-[-0.24px]">
            {amount}
          </p>
          <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[#928dd3]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {percentage} of total
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

export function Expenses() {
  const { currentOwner } = useOwner();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const expenses: ExpenseRowProps[] = [
    {
      category: "Utilities",
      description: "Electricity Bill - March",
      property: "Sunset Apartments",
      amount: "$2,400",
      date: "Mar 5, 2026",
      paymentStatus: "paid"
    },
    {
      category: "Maintenance",
      description: "HVAC Repair",
      property: "Harbor View Complex",
      amount: "$3,200",
      date: "Mar 10, 2026",
      paymentStatus: "paid"
    },
    {
      category: "Insurance",
      description: "Property Insurance - Q1",
      property: "All Properties",
      amount: "$8,500",
      date: "Mar 1, 2026",
      paymentStatus: "pending"
    },
    {
      category: "Utilities",
      description: "Water & Sewage",
      property: "Downtown Lofts",
      amount: "$1,800",
      date: "Mar 5, 2026",
      paymentStatus: "paid"
    },
    {
      category: "Maintenance",
      description: "Landscaping Service",
      property: "Parkside Residences",
      amount: "$1,200",
      date: "Mar 12, 2026",
      paymentStatus: "pending"
    },
    {
      category: "Taxes",
      description: "Property Tax - Q1",
      property: "All Properties",
      amount: "$12,000",
      date: "Mar 15, 2026",
      paymentStatus: "overdue"
    },
    {
      category: "Other",
      description: "Pest Control Service",
      property: "Metro Plaza",
      amount: "$450",
      date: "Mar 8, 2026",
      paymentStatus: "paid"
    },
    {
      category: "Maintenance",
      description: "Elevator Maintenance",
      property: "Riverside Towers",
      amount: "$2,100",
      date: "Mar 14, 2026",
      paymentStatus: "pending"
    }
  ];

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(exp => exp.category === selectedCategory);

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Expenses
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Track property expenses for {currentOwner.name}
            </p>
          </div>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add Expense
            </p>
          </button>
        </div>
      </div>

      <div className="content-stretch flex gap-[16px] items-start px-[48px] pb-[24px] relative w-full flex-wrap">
        <CategoryCard category="Utilities" amount="$4,200" percentage="14%" />
        <CategoryCard category="Maintenance" amount="$6,500" percentage="22%" />
        <CategoryCard category="Insurance" amount="$8,500" percentage="28%" />
        <CategoryCard category="Taxes" amount="$12,000" percentage="40%" />
        <CategoryCard category="Other" amount="$450" percentage="1.5%" />
      </div>

      <div className="px-[48px] pb-[24px]">
        <div className="relative inline-block">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] pr-[36px] relative rounded-[8px] shrink-0 border border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.05)] transition-colors appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Utilities">Utilities</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Insurance">Insurance</option>
            <option value="Taxes">Taxes</option>
            <option value="Other">Other</option>
          </select>
          <div className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
            <CaretDown />
          </div>
        </div>
      </div>

      <div className="bg-black mx-[48px] mb-[48px] rounded-[16px] relative">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)]">
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Category
            </p>
            <p className="flex-[2_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Description
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Amount
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Date
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Payment Status
            </p>
            <div className="w-[24px]" />
          </div>
          {filteredExpenses.map((expense, index) => (
            <ExpenseRow key={index} {...expense} />
          ))}
        </div>
      </div>
    </div>
  );
}