import { useState } from 'react';
import { useOwner } from '../context/OwnerContext';
import { CreateTenantDialog } from '../components/dialogs/CreateTenantDialog';
import { LinkAdditionalUnitDialog } from '../components/dialogs/LinkAdditionalUnitDialog';
import { StatusBadge, type PaymentStatus } from '../components/StatusBadge';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';
import svgPaths from "../../imports/svg-zayt9vop9f";

function Phone() {
  return (
    <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.17997C2.095 3.90344 2.12787 3.62474 2.21649 3.3616C2.30512 3.09846 2.44756 2.85666 2.63476 2.65162C2.82196 2.44658 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 1.99997H7.10999C7.5953 1.9952 8.06579 2.16705 8.43376 2.48351C8.80173 2.79996 9.04207 3.23945 9.10999 3.71997C9.23662 4.68004 9.47144 5.6227 9.80999 6.52997C9.94454 6.88793 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.63998L8.08999 9.90997C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

interface TenantRowProps {
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
  ownerPhone?: string;
  onDelete?: () => void;
  onLinkUnit?: () => void;
  onDeleteTenant?: () => void;
  onStatusChange?: (status: PaymentStatus) => void;
}

function TenantRow({ id, tenant, email, phone, property, propertyId, unit, unitId, amount, status, hasAssignment, ownerPhone = '+1 (555) 123-4567', onDelete, onLinkUnit, onDeleteTenant, onStatusChange }: TenantRowProps) {
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
            title={hasAssignment ? "Cambiar estado de pago" : "Este inquilino no tiene asignaciones"}
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
                    {paymentStatus === 'paid' && 'Pagado'}
                    {paymentStatus === 'pending' && 'Pendiente'}
                    {paymentStatus === 'overdue' && 'Vencido'}
                    {paymentStatus === 'partial' && 'Parcial'}
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
          title="Opciones"
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
                  {hasAssignment ? '+Vincular unidad' : 'Vincular unidad'}
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
                      Eliminar vínculo
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
                  Eliminar Tenant
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
  const { currentOwner, tenants, properties, refreshTenants, refreshProperties } = useOwner();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTenantForLink, setSelectedTenantForLink] = useState<string | null>(null);

  const getTenantRows = () => {
    const rows: any[] = [];
    
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
            unit: `Unidad ${unit.unitNumber}`,
            unitId: unit.id,
            amount: `$${assignment.rentAmount.toLocaleString()}`,
            status: assignment.paymentStatus,
            ownerPhone: currentOwner.name,
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
          property: 'Sin Asignar',
          propertyId: '',
          unit: '-',
          unitId: '',
          amount: '-',
          status: 'pending' as PaymentStatus,
          ownerPhone: currentOwner.name,
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
    if (confirm('¿Estás seguro de que deseas eliminar este vínculo?')) {
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
        alert('Error al eliminar vínculo');
      }
    }
  };

  const handleDeleteTenantCompletely = (tenantId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este tenant completamente? Esta acción no se puede deshacer.')) {
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
        alert('Error al eliminar tenant');
      }
    }
  };

  const handlePaymentStatusChange = (tenantId: string, propertyId: string, unitId: string, paymentStatus: PaymentStatus) => {
    try {
      tenantService.updatePaymentStatus(tenantId, propertyId, unitId, paymentStatus);
      refreshTenants();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error al actualizar estado de pago');
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
            tenantRows.map((row, index) => (
              <TenantRow 
                key={index}
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
