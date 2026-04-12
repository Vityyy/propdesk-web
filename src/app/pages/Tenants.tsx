import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { StatusBadge, type PaymentStatus } from '../components/StatusBadge';
import svgPaths from "../../imports/svg-zayt9vop9f";

function Phone() {
  return (
    <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.17997C2.095 3.90344 2.12787 3.62474 2.21649 3.3616C2.30512 3.09846 2.44756 2.85666 2.63476 2.65162C2.82196 2.44658 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 1.99997H7.10999C7.5953 1.9952 8.06579 2.16705 8.43376 2.48351C8.80173 2.79996 9.04207 3.23945 9.10999 3.71997C9.23662 4.68004 9.47144 5.6227 9.80999 6.52997C9.94454 6.88793 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.63998L8.08999 9.90997C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

interface TenantRowProps {
  tenant: string;
  property: string;
  unit: string;
  amount: string;
  dueDate: string;
  status: PaymentStatus;
  ownerPhone?: string;
  tenantPhone?: string;
  onStatusChange?: (status: PaymentStatus) => void;
}

function TenantRow({ tenant, property, unit, amount, dueDate, status, onStatusChange, ownerPhone = '+1 (555) 123-4567', tenantPhone = '+1 (555) 987-6543' }: TenantRowProps) {
  const [showContactMenu, setShowContactMenu] = useState(false);

  const handleContact = (type: 'owner' | 'tenant', phone: string) => {
    setShowContactMenu(false);
    // In a real app, this would initiate a call or open a messaging interface
    console.log(`Contacting ${type}: ${phone}`);
  };

  return (
    <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <div className="flex-[2_0_0]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {tenant}
        </p>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {property} - {unit}
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
        <StatusBadge status={status} onStatusChange={onStatusChange} />
      </div>
      <div className="relative">
        <button 
          onClick={() => setShowContactMenu(!showContactMenu)}
          className="hover:bg-[rgba(255,255,255,0.05)] transition-colors p-[8px] rounded-[8px] text-white hover:text-[#928dd3]"
        >
          <Phone />
        </button>

        {showContactMenu && (
          <>
            <div 
              className="fixed inset-0 z-[10]" 
              onClick={() => setShowContactMenu(false)}
            />
            <div className="absolute top-[calc(100%+8px)] right-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[220px] z-[11] overflow-hidden">
              <button
                onClick={() => handleContact('tenant', tenantPhone)}
                className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white mb-[2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Contact Tenant
                </p>
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {tenantPhone}
                </p>
              </button>
              <div className="border-t border-[rgba(255,255,255,0.16)]" />
              <button
                onClick={() => handleContact('owner', ownerPhone)}
                className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white mb-[2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Contact Owner
                </p>
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {ownerPhone}
                </p>
              </button>
            </div>
          </>
        )}
      </div>
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

export function Tenants() {
  const { currentOwner } = useOwner();
  const [tenants, setTenants] = useState<TenantRowProps[]>([
    {
      tenant: "John Smith",
      property: "Sunset Apartments",
      unit: "Unit 101",
      amount: "$1,200",
      dueDate: "Mar 1, 2026",
      status: "paid",
      tenantPhone: "+1 (555) 234-5678",
      ownerPhone: "+1 (555) 123-4567"
    },
    {
      tenant: "Sarah Johnson",
      property: "Harbor View",
      unit: "Unit 205",
      amount: "$1,350",
      dueDate: "Mar 1, 2026",
      status: "paid",
      tenantPhone: "+1 (555) 345-6789",
      ownerPhone: "+1 (555) 123-4567"
    },
    {
      tenant: "Michael Chen",
      property: "Downtown Lofts",
      unit: "Unit 304",
      amount: "$1,800",
      dueDate: "Mar 1, 2026",
      status: "pending",
      tenantPhone: "+1 (555) 456-7890",
      ownerPhone: "+1 (555) 123-4567"
    },
    {
      tenant: "Emily Davis",
      property: "Parkside",
      unit: "Unit 112",
      amount: "$1,150",
      dueDate: "Feb 1, 2026",
      status: "overdue",
      tenantPhone: "+1 (555) 567-8901",
      ownerPhone: "+1 (555) 123-4567"
    },
    {
      tenant: "David Wilson",
      property: "Riverside Towers",
      unit: "Unit 501",
      amount: "$1,500",
      dueDate: "Mar 1, 2026",
      status: "paid",
      tenantPhone: "+1 (555) 678-9012",
      ownerPhone: "+1 (555) 123-4567"
    },
    {
      tenant: "Lisa Anderson",
      property: "Metro Plaza",
      unit: "Unit 203",
      amount: "$1,400",
      dueDate: "Mar 1, 2026",
      status: "pending",
      tenantPhone: "+1 (555) 789-0123",
      ownerPhone: "+1 (555) 123-4567"
    }
  ]);

  const handleTenantStatusChange = (index: number, newStatus: PaymentStatus) => {
    const updatedTenants = [...tenants];
    updatedTenants[index].status = newStatus;
    setTenants(updatedTenants);
  };

  return (
    <div className="bg-black min-h-full w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Tenants
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Manage tenant payments for {currentOwner.name}
            </p>
          </div>
          <button className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors">
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Record Payment
            </p>
          </button>
        </div>
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
            <div className="w-[40px] flex items-center justify-center">
              <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Contact
              </p>
            </div>
          </div>
          {tenants.map((tenant, index) => (
            <TenantRow 
              key={index} 
              {...tenant} 
              onStatusChange={(newStatus) => handleTenantStatusChange(index, newStatus)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
