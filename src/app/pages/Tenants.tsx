import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { CreateTenantDialog } from '../components/dialogs/CreateTenantDialog';
import { LinkAdditionalUnitDialog } from '../components/dialogs/LinkAdditionalUnitDialog';
import { StatusBadge, type PaymentStatus } from '../components/StatusBadge';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';

interface TenantRowProps {
  tenant: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  amount: string;
  status: PaymentStatus;
  hasAssignment: boolean;
  onDelete?: () => void;
  onLinkUnit?: () => void;
  onDeleteTenant?: () => void;
  onStatusChange?: (status: PaymentStatus) => void;
}

function TenantRow({ tenant, email, phone, property, unit, amount, status, hasAssignment, onDelete, onLinkUnit, onDeleteTenant, onStatusChange }: TenantRowProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);

  return (
    <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <div className="flex-[2.5_0_0]">
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {tenant}
        </p>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {email}
        </p>
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {phone}
        </p>
      </div>
      <div className="flex-[2_0_0]">
        <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {property}
        </p>
        <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {unit}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <p className="font-['Chivo:Black',sans-serif] font-black leading-[24px] text-[20px] text-white tracking-[-0.2px]">
          {amount}
        </p>
      </div>
      <div className="flex-[1_0_0]">
        <div className="relative w-fit">
          <button
            onClick={() => setShowPaymentMenu(!showPaymentMenu)}
            className={`transition-opacity ${hasAssignment ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            title={hasAssignment ? "Change payment status" : "This tenant has no active assignment"}
            disabled={!hasAssignment}
          >
            <StatusBadge status={status} />
          </button>

          {showPaymentMenu && hasAssignment && (
            <>
              <div 
                className="fixed inset-0 z-[10]" 
                onClick={() => setShowPaymentMenu(false)}
              />
              <div className="absolute top-[calc(100%+8px)] left-0 bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[160px] z-[11] overflow-hidden">
                {(['paid', 'pending', 'overdue', 'partial'] as const).map((paymentStatus) => (
                  <button
                    key={paymentStatus}
                    onClick={() => {
                      setShowPaymentMenu(false);
                      onStatusChange?.(paymentStatus);
                    }}
                    className={`w-full text-left px-[12px] py-[8px] text-sm transition-colors ${
                      status === paymentStatus
                        ? 'bg-[#928dd3] text-black font-semibold'
                        : 'hover:bg-[rgba(255,255,255,0.05)] text-white'
                    }`}
                  >
                    {paymentStatus === 'paid' && 'Paid'}
                    {paymentStatus === 'pending' && 'Pending'}
                    {paymentStatus === 'overdue' && 'Overdue'}
                    {paymentStatus === 'partial' && 'Partial'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          className="hover:bg-[rgba(255,255,255,0.05)] transition-colors p-[8px] rounded-[8px] text-white hover:text-[#928dd3]"
          title="Options"
        >
          ⋮
        </button>

        {showOptionsMenu && (
          <>
            <div 
              className="fixed inset-0 z-[10]" 
              onClick={() => setShowOptionsMenu(false)}
            />
            <div className="absolute top-[calc(100%+8px)] right-[100px] bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] min-w-[200px] z-[11] overflow-hidden">
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  onLinkUnit?.();
                }}
                className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {hasAssignment ? 'Link another unit' : 'Link unit'}
                </p>
              </button>
              {hasAssignment && (
                <>
                  <div className="border-t border-[rgba(255,255,255,0.16)]" />
                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      onDelete?.();
                    }}
                    className="w-full text-left px-[16px] py-[12px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Remove assignment
                    </p>
                  </button>
                </>
              )}
              <div className="border-t border-[rgba(255,255,255,0.16)]" />
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  onDeleteTenant?.();
                }}
                className="w-full text-left px-[16px] py-[12px] hover:bg-[#ff6b6b]/10 transition-colors"
              >
                <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Delete tenant
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

interface TenantTableRow {
  id: string;
  tenant: string;
  email: string;
  phone: string;
  property: string;
  propertyId: string;
  unit: string;
  unitId: string;
  amount: string;
  status: PaymentStatus;
  hasAssignment: boolean;
}

export function Tenants() {
  const { currentOwner, tenants, properties, refreshTenants, refreshProperties } = useOwner();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTenantForLink, setSelectedTenantForLink] = useState<string | null>(null);

  const getTenantRows = () => {
    const rows: TenantTableRow[] = [];

    tenants.forEach((tenant) => {
      // Get ACTIVE assignments
      const activeAssignments = tenant.assignedProperties.filter(a => a.status === 'active');
      
      // If tenant has active assignments, show one row per assignment
      if (activeAssignments.length > 0) {
        activeAssignments.forEach((assignment) => {
          const property = properties.find(p => p.id === assignment.propertyId);
          const unit = property?.units.find(u => u.id === assignment.unitId);

          if (!property || !unit) return;

          rows.push({
            id: tenant.id,
            tenant: `${tenant.firstName} ${tenant.lastName}`,
            email: tenant.email,
            phone: tenant.phone,
            property: property.name,
            propertyId: property.id,
            unit: `Unit ${unit.unitNumber}`,
            unitId: unit.id,
            amount: `$${assignment.rentAmount.toLocaleString()}`,
            status: assignment.paymentStatus,
            hasAssignment: true,
          });
        });
      } else {
        // Tenant without active assignments
        rows.push({
          id: tenant.id,
          tenant: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
          phone: tenant.phone,
          property: 'Unassigned',
          propertyId: '',
          unit: '-',
          unitId: '',
          amount: '-',
          status: 'pending' as PaymentStatus,
          hasAssignment: false,
        });
      }
    });

    return rows;
  };

  const tenantRows = getTenantRows();

  const totalCollected = tenants.reduce((sum, t) => {
    // Sum ALL active assignments for each tenant
    const activeTotal = t.assignedProperties
      .filter(a => a.status === 'active')
      .reduce((total, assignment) => total + assignment.rentAmount, 0);
    return sum + activeTotal;
  }, 0);

  const handleDeleteTenant = (tenantId: string, propertyId: string, unitId: string) => {
    if (confirm('Remove this tenant from the selected unit?')) {
      try {
        // Only unassign from this specific unit
        propertyService.unassignTenantFromUnit(propertyId, unitId);
        
        // Unassign in tenant's assignedProperties
        tenantService.unassignFromUnit(tenantId, propertyId, unitId);
        
        // Refresh both lists
        refreshTenants();
        refreshProperties();
      } catch (error) {
        console.error('Error deleting link:', error);
        alert('Could not remove assignment');
      }
    }
  };

  const handleDeleteTenantCompletely = (tenantId: string) => {
    if (confirm('Delete this tenant permanently? This cannot be undone.')) {
      try {
        // Get tenant data before deleting
        const tenant = tenantService.getTenant(tenantId);
        
        // Unassign from all properties
        if (tenant && tenant.assignedProperties) {
          tenant.assignedProperties.forEach(assignment => {
            if (assignment.status === 'active') {
              propertyService.unassignTenantFromUnit(assignment.propertyId, assignment.unitId);
            }
          });
        }
        
        // Delete the tenant completely
        tenantService.deleteTenant(tenantId);
        
        // Refresh both lists
        refreshTenants();
        refreshProperties();
      } catch (error) {
        console.error('Error deleting tenant:', error);
        alert('Could not delete tenant');
      }
    }
  };

  const handlePaymentStatusChange = (tenantId: string, propertyId: string, unitId: string, paymentStatus: PaymentStatus) => {
    try {
      tenantService.updatePaymentStatus(tenantId, propertyId, unitId, paymentStatus);
      refreshTenants();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Could not update payment status');
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
          <button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#928dd3] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#7f7ab8] transition-colors"
          >
            <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] text-black whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add Tenant
            </p>
          </button>
        </div>
      </div>

      <div className="content-stretch flex gap-[24px] items-start px-[48px] pb-[24px] relative w-full">
        <SummaryCard title="Total Tenants" value={tenants.length.toString()} subtitle="Active tenants" />
        <SummaryCard title="Expected Revenue" value={`$${totalCollected.toLocaleString()}`} subtitle="Monthly" />
        <SummaryCard title="Occupied Units" value={properties.reduce((sum, p) => sum + p.occupiedUnits, 0).toString()} subtitle={`of ${properties.reduce((sum, p) => sum + p.totalUnits, 0)}`} />
      </div>

      <div className="bg-black mx-[48px] mb-[48px] rounded-[16px] relative">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[16px]" />
        <div className="overflow-visible rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between py-[16px] px-[24px] relative shrink-0 w-full border-b border-[rgba(255,255,255,0.16)]">
            <p className="flex-[2.5_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Tenant
            </p>
            <p className="flex-[2_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Property / Unit
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Amount
            </p>
            <p className="flex-[1_0_0] font-['Archivo:ExtraBold',sans-serif] font-extrabold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              Status
            </p>
          </div>
          {tenantRows.length === 0 ? (
            <div className="py-8 px-4 text-center text-[rgba(255,255,255,0.6)]">
              No tenants yet. Create one to get started!
            </div>
          ) : (
            tenantRows.map((row) => (
              <TenantRow
                key={`${row.id}-${row.propertyId || 'unassigned'}-${row.unitId || 'none'}`}
                {...row}
                onDelete={() => handleDeleteTenant(row.id, row.propertyId, row.unitId)}
                onLinkUnit={() => setSelectedTenantForLink(row.id)}
                onDeleteTenant={() => handleDeleteTenantCompletely(row.id)}
                onStatusChange={(newStatus) => handlePaymentStatusChange(row.id, row.propertyId, row.unitId, newStatus)}
              />
            ))
          )}
        </div>
      </div>

      <CreateTenantDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => setShowCreateDialog(false)}
      />

      <LinkAdditionalUnitDialog
        isOpen={!!selectedTenantForLink}
        tenantId={selectedTenantForLink || ''}
        properties={properties}
        onClose={() => setSelectedTenantForLink(null)}
        onSuccess={() => {
          setSelectedTenantForLink(null);
          refreshTenants();
          refreshProperties();
        }}
      />
    </div>
  );
}
