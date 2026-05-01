import { useState, useEffect } from 'react';
import { useOwner } from '../context/OwnerContext';
import type { Tenant } from '../types/index';
import { EditTenantDialog } from '../components/dialogs/EditTenantDialog';
import { TenantDetailsDialog } from '../components/dialogs/TenantDetailsDialog';
import userService from '../../services/userService';

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

interface TenantRowProps {
  id: string;
  tenant: string;
  email: string;
  phone: string;
  onEdit?: () => void;
  onClick?: () => void;
}

function TenantRow({ id, tenant, email, phone, onEdit, onClick }: TenantRowProps) {
  return (
    <div 
      className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {tenant}
        </p>
      </div>
      
      <div className="flex-1 min-w-0 px-[24px]">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {email}
        </p>
      </div>
      
      <div className="flex-1 min-w-0 px-[24px]">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
          {phone}
        </p>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onEdit}
          className="bg-black/40 hover:bg-[#928dd3]/80 backdrop-blur-sm p-1.5 rounded transition-colors text-white hover:text-black"
          title="Edit tenant"
        >
          <EditIcon />
        </button>
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
  const { currentOwner, tenants, properties, refreshTenants, refreshProperties } = useOwner();
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [detailsTenant, setDetailsTenant] = useState<Tenant | null>(null);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [occupiedApartments, setOccupiedApartments] = useState(0);
  const [totalApartments, setTotalApartments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    refreshTenants();
  }, []);
  
  useEffect(() => {
    const calculateOccupancy = async () => {
      let totalApartments = 0;
      let occupiedApartments = 0;
      
      for (const property of properties) {
        try {
          const gridData = await userService.getPropertyApartmentsGrid(property.id);
          Object.values(gridData).forEach(floorApts => {
            Object.values(floorApts).forEach((apt: any) => {
              totalApartments++;
              if (apt.tenant) {
                occupiedApartments++;
              }
            });
          });
        } catch (error) {
          console.error(`Error fetching apartments for property ${property.id}`, error);
        }
      }
      
      const rate = totalApartments > 0 ? Math.round((occupiedApartments / totalApartments) * 100) : 0;
      setOccupancyRate(rate);
      setTotalApartments(totalApartments);
      setOccupiedApartments(occupiedApartments);
    };
    
    if (properties.length > 0) {
      calculateOccupancy();
    }
  }, [properties]);

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
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[24px] px-[48px] relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div>
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] relative shrink-0 text-[34px] text-white tracking-[-0.34px] whitespace-nowrap">
              Tenants
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Manage {tenants.length} tenants for {currentOwner.name}
            </p>
          </div>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <SummaryCard title="Total Tenants" value={tenants.length.toString()} subtitle="Active tenants" />
        <SummaryCard title="Occupancy Rate" value={`${occupancyRate}%`} subtitle={`${occupiedApartments} occupied out of ${totalApartments} apartments`} />
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search tenants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-white/40 text-sm focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-black mx-[48px] mb-[48px] rounded-[16px] relative">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <div className="overflow-visible rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)]">
            <p className="flex-1 font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Name
            </p>
            <p className="flex-1 px-[24px] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Email
            </p>
            <p className="flex-1 px-[24px] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Phone
            </p>
            <p className="font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white flex-shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
              Actions
            </p>
          </div>
          {tenantRows.length === 0 ? (
            <div className="py-8 px-4 text-center text-[rgba(255,255,255,0.6)]">
              No tenants yet. Create one to get started!
            </div>
          ) : (
            tenantRows.map((row) => (
              <TenantRow
                key={row.id}
                {...row}
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
