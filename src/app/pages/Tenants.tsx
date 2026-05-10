import { useState, useEffect } from 'react';
import { useOwner } from '../context/OwnerContext';
import type { Tenant } from '../types/index';
import { EditTenantDialog } from '../components/dialogs/EditTenantDialog';
import { TenantDetailsDialog } from '../components/dialogs/TenantDetailsDialog';
import userService, { type ApartmentGridResponse } from '../../services/userService';

import { Pencil, Search, Users } from 'lucide-react';

interface TenantRowProps {
  id: string;
  tenant: string;
  email: string;
  phone: string;
  paymentStatus: 'PAID' | 'PENDING' | 'UNKNOWN';
  onEdit?: () => void;
  onClick?: () => void;
}

function TenantRow({ tenant, email, phone, paymentStatus, onEdit, onClick }: TenantRowProps) {
  const displayEmail = email && email.trim() ? email : '-';
  const displayPhone = phone && phone.trim() ? phone : '-';

  // Badge color and text based on payment status
  let badgeColor = '#928dd3'; // default (UNKNOWN)
  let badgeText = 'No Data';
  let badgeBg = 'bg-[#928dd3]/15';
  let badgeBorder = 'border-[#928dd3]/40';

  if (paymentStatus === 'PAID') {
    badgeColor = '#4ade80';
    badgeText = 'Paid';
    badgeBg = 'bg-[#4ade80]/15';
    badgeBorder = 'border-[#4ade80]/40';
  } else if (paymentStatus === 'PENDING') {
    badgeColor = '#f59e0b';
    badgeText = 'Pending';
    badgeBg = 'bg-[#f59e0b]/15';
    badgeBorder = 'border-[#f59e0b]/40';
  }

  return (
    <div 
      className="content-stretch grid grid-cols-[minmax(140px,1.5fr)_minmax(180px,2fr)_minmax(140px,1.5fr)_120px_80px] items-center gap-4 py-[16px] px-[24px] relative shrink-0 w-full border-b border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="min-w-0">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {tenant}
        </p>
      </div>
      
      <div className="min-w-0 text-center">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {displayEmail}
        </p>
      </div>
      
      <div className="min-w-0 text-center">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {displayPhone}
        </p>
      </div>

      <div className="flex justify-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg} ${badgeBorder}`}
          style={{ color: badgeColor }}
        >
          {badgeText}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onEdit}
          className="bg-black/40 hover:bg-[#928dd3] backdrop-blur-md p-2 rounded-lg transition-all duration-200 text-white hover:text-black border border-white/5 hover:border-[#928dd3] hover:shadow-[0_0_15px_rgba(146,141,211,0.4)]"
          title="Edit tenant"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, isLoading }: { title: string; value: string; subtitle: string; isLoading?: boolean }) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-white/20 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)] transition-all duration-300 flex-[1_0_0] min-w-[200px] relative rounded-[16px]">
      <div className="overflow-hidden rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[24px] relative w-full">
          <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[24px] text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
            {title}
          </p>
          {isLoading ? (
            <>
              <div className="h-8 w-24 bg-[rgba(255,255,255,0.06)] rounded mb-2 animate-pulse" />
              <div className="h-3 w-40 bg-[rgba(146,141,211,0.08)] rounded animate-pulse" />
            </>
          ) : (
            <>
              <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] text-white tracking-[-0.34px]">
                {value}
              </p>
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[16px] text-[13px] text-[#928dd3]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {subtitle}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Tenants() {
  const { currentOwner, tenants, properties, isLoadingProperties, refreshTenants } = useOwner();
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [detailsTenant, setDetailsTenant] = useState<Tenant | null>(null);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [occupiedApartments, setOccupiedApartments] = useState(0);
  const [totalApartments, setTotalApartments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantPaymentStatus, setTenantPaymentStatus] = useState<Record<string, 'PAID' | 'PENDING' | 'UNKNOWN'>>({});
  const [isCalculatingMetrics, setIsCalculatingMetrics] = useState(true);

  useEffect(() => {
    refreshTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    let isMounted = true;

    const calculateOccupancy = async () => {
      setIsCalculatingMetrics(true);
      let totalApartments = 0;
      let occupiedApartments = 0;
      const paymentStatusMap: Record<string, 'PAID' | 'PENDING' | 'UNKNOWN'> = {};

      // Initialize all tenants as UNKNOWN
      tenants.forEach(tenant => {
        paymentStatusMap[tenant.id] = 'UNKNOWN';
      });

      for (const property of properties) {
        try {
          const gridData = await userService.getPropertyApartmentsGrid(property.id);
          if (!isMounted) return;
          Object.values(gridData).forEach(floorApts => {
            Object.values(floorApts).forEach((apt: ApartmentGridResponse) => {
              totalApartments++;
              if (apt.tenant) {
                occupiedApartments++;

                // Track payment status for this tenant across all apartments
                const tenantId = apt.tenant.id;
                if (tenantId && Object.prototype.hasOwnProperty.call(paymentStatusMap, tenantId)) {
                  // If we haven't seen this tenant yet, initialize based on first apartment
                  if (paymentStatusMap[tenantId] === 'UNKNOWN') {
                    paymentStatusMap[tenantId] = apt.paymentStatus === 'PAID' ? 'PAID' : 'PENDING';
                  } else if (paymentStatusMap[tenantId] === 'PAID' && apt.paymentStatus !== 'PAID') {
                    // If tenant was PAID but this apartment is not, change to PENDING
                    paymentStatusMap[tenantId] = 'PENDING';
                  }
                }
              }
            });
          });
        } catch (error) {
          console.error(`Error fetching apartments for property ${property.id}`, error);
        }
      }
      
      if (isMounted) {
        const rate = totalApartments > 0 ? Math.round((occupiedApartments / totalApartments) * 100) : 0;
        setOccupancyRate(rate);
        setTotalApartments(totalApartments);
        setOccupiedApartments(occupiedApartments);
        setTenantPaymentStatus(paymentStatusMap);
        setIsCalculatingMetrics(false);
      }
    };
    
    if (properties.length > 0) {
      calculateOccupancy();
    }
    else if (!isLoadingProperties) {
      setIsCalculatingMetrics(false);
    }

    return () => {
      isMounted = false;
    };
  }, [properties, tenants, isLoadingProperties]);

  const isPageLoading = isLoadingProperties || isCalculatingMetrics;

  const getTenantRows = () => {
    return tenants
      .filter(tenant => {
        const name = tenant.name.toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      })
      .map(tenant => ({
        id: tenant.id,
        tenant: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        paymentStatus: tenantPaymentStatus[tenant.id] || 'UNKNOWN',
      }));
  };

  const tenantRows = getTenantRows();

  const handleEditTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setEditingTenant(tenant);
    }
  };

  const handleViewTenantDetails = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setDetailsTenant(tenant);
    }
  };

  return (
    <div className="bg-black min-h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-12">
        <div>
          <h1 className="font-black text-4xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Chivo', sans-serif" }}>
            <Users className="text-[#928dd3]" size={36} />
            Tenants
          </h1>
          <p className="text-white/50 text-sm mt-2 font-['Archivo:Medium',sans-serif]">
            Manage {tenants.length} tenants for {currentOwner.name}
          </p>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <SummaryCard isLoading={isPageLoading} title="Total Tenants" value={tenants.length.toString()} subtitle="Active tenants" />
        <SummaryCard isLoading={isPageLoading} title="Occupancy Rate" value={`${occupancyRate}%`} subtitle={`${occupiedApartments} occupied out of ${totalApartments} apartments`} />
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 focus-within:border-[#928dd3] focus-within:bg-white/[0.05] focus-within:ring-1 focus-within:ring-[#928dd3] rounded-[12px] px-4 py-3 text-white transition-all duration-300">
          <Search size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="Search tenants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-white/30 text-sm focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-lg mx-[48px] mb-[48px] rounded-[16px] relative overflow-hidden">
        <div className="overflow-visible rounded-[inherit] size-full">
           <div className="content-stretch grid grid-cols-[minmax(140px,1.5fr)_minmax(180px,2fr)_minmax(140px,1.5fr)_120px_80px] items-center gap-4 py-[16px] px-[24px] relative shrink-0 w-full border-b border-white/10 bg-white/[0.02]">
             <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
               Name
             </p>
             <p className="text-center font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
               Email
             </p>
             <p className="text-center font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
               Phone
             </p>
             <p className="text-center font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
               Status
             </p>
             <p className="text-center font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
               Actions
             </p>
           </div>
           {isPageLoading ? (
               <TenantSkeleton />
           ) : tenantRows.length === 0 ? (
             <div className="py-8 px-4 text-center text-[rgba(255,255,255,0.6)]">
               No tenants yet. Create one to get started!
             </div>
           ) : (
             tenantRows.map((row) => (
               <TenantRow
                 key={row.id}
                 id={row.id}
                 tenant={row.tenant}
                 email={row.email}
                 phone={row.phone}
                 paymentStatus={row.paymentStatus}
                 onEdit={() => handleEditTenant(row.id)}
                 onClick={() => handleViewTenantDetails(row.id)}
               />
             ))
           )}
        </div>
      </div>

      <EditTenantDialog
        isOpen={!!editingTenant}
        tenant={editingTenant}
        onClose={() => setEditingTenant(null)}
        onSuccess={() => {
          setEditingTenant(null);
        }}
      />

      <TenantDetailsDialog
        isOpen={!!detailsTenant}
        tenant={detailsTenant}
        onClose={() => setDetailsTenant(null)}
      />
    </div>
  );
}

function TenantSkeleton() {
  return (
    <div className="content-stretch grid grid-cols-[minmax(140px,1.5fr)_minmax(180px,2fr)_minmax(140px,1.5fr)_120px_80px] items-center gap-4 py-[16px] px-[24px] relative shrink-0 w-full border-b border-white/5 animate-pulse">
      <div className="h-4 w-3/4 bg-[rgba(255,255,255,0.06)] rounded" />
      <div className="h-3 w-3/4 bg-[rgba(255,255,255,0.04)] rounded mx-auto" />
      <div className="h-3 w-3/4 bg-[rgba(255,255,255,0.04)] rounded mx-auto" />
      <div className="flex justify-center">
        <div className="h-4 w-16 bg-[rgba(255,255,255,0.06)] rounded-full" />
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="h-8 w-8 bg-[rgba(255,255,255,0.06)] rounded" />
      </div>
    </div>
  );
}
