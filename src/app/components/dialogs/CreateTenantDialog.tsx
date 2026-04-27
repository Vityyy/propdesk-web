import { useState } from 'react';
import type { Tenant } from '../../types/index';
import { tenantService } from '../../../services/tenantService';
import { propertyService } from '../../../services/propertyService';
import { useOwner } from '../../context/OwnerContext';
import { validation } from '../../../utils/validation';

interface CreateTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateTenantDialog({ isOpen, onClose, onSuccess }: CreateTenantDialogProps) {
  const { currentOwner, refreshTenants, refreshProperties, properties } = useOwner();
  const [step, setStep] = useState<'info' | 'assignment'>('info');
  const [tenantData, setTenantData] = useState<Partial<Tenant>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentNumber: '',
    documentType: 'DNI',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [newTenant, setNewTenant] = useState<Tenant | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    propertyId: '',
    unitId: '',
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!tenantData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!tenantData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (tenantData.email?.trim() && !validation.validateEmail(tenantData.email)) {
      errors.email = 'Enter a valid email (must include @ and a domain)';
    }
    if (!tenantData.phone?.trim()) {
      errors.phone = 'Phone is required';
    } else if (!validation.validatePhone(tenantData.phone)) {
      errors.phone = 'Phone may only contain digits, +, spaces, hyphens, and parentheses';
    }
    if (!tenantData.documentNumber?.trim()) {
      errors.documentNumber = 'ID number is required';
    } else if (!validation.validateDocumentNumber(tenantData.documentNumber)) {
      errors.documentNumber = 'ID number must contain digits only';
    } else if (tenantService.tenantExists(currentOwner.id, tenantData.documentNumber)) {
      errors.documentNumber = 'A tenant with this ID number already exists';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const created = tenantService.createTenant({
        ownerId: currentOwner.id,
        firstName: tenantData.firstName!,
        lastName: tenantData.lastName!,
        email: tenantData.email?.trim() || '',
        phone: tenantData.phone!,
        documentNumber: tenantData.documentNumber!,
        documentType: 'DNI',
      });

      setNewTenant(created);
      setStep('assignment');
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Could not create tenant');
    }
  };

  const handleSkipAssignment = () => {
    // Create tenant without assignment
    if (newTenant) {
      refreshTenants();
      onSuccess?.();
      handleClose();
    }
  };

  const handleAssignUnit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentData.propertyId || !assignmentData.unitId) {
      alert('Please fill in all fields');
      return;
    }

    if (!newTenant) return;

    try {
      // Get the selected unit to obtain its rent amount
      const property = propertyService.getProperty(assignmentData.propertyId);
      if (!property) {
        alert('Property not found');
        return;
      }

      const unit = property.units.find(u => u.id === assignmentData.unitId);
      if (!unit) {
        alert('Unit not found');
        return;
      }

      // Assign tenant to unit
      propertyService.assignTenantToUnit(
        assignmentData.propertyId,
        assignmentData.unitId,
        newTenant.id
      );

      // Create assignment in tenant using unit's rent amount
      tenantService.assignToUnit(
        newTenant.id,
        assignmentData.propertyId,
        assignmentData.unitId,
        unit.rentAmount
      );

      refreshTenants();
      refreshProperties();
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error assigning tenant:', error);
      alert('Could not assign tenant to unit');
    }
  };

  const handleClose = () => {
    setStep('info');
    setTenantData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentNumber: '',
      documentType: 'DNI',
    });
    setNewTenant(null);
    setAssignmentData({ propertyId: '', unitId: '' });
    setValidationErrors({});
    onClose();
  };

  const availableUnits = assignmentData.propertyId
    ? propertyService.getProperty(assignmentData.propertyId)?.units.filter(u => !u.tenant) || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            {step === 'info' ? 'New tenant' : 'Assign unit'}
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {step === 'info' ? (
          <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  First name *
                </label>
                <input
                  type="text"
                  value={tenantData.firstName || ''}
                  onChange={(e) => {
                    setTenantData({ ...tenantData, firstName: e.target.value });
                    if (validationErrors.firstName) {
                      setValidationErrors({ ...validationErrors, firstName: '' });
                    }
                  }}
                  className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                    validationErrors.firstName ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
                  }`}
                  placeholder="First name"
                />
                {validationErrors.firstName && (
                  <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Last name *
                </label>
                <input
                  type="text"
                  value={tenantData.lastName || ''}
                  onChange={(e) => {
                    setTenantData({ ...tenantData, lastName: e.target.value });
                    if (validationErrors.lastName) {
                      setValidationErrors({ ...validationErrors, lastName: '' });
                    }
                  }}
                  className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                    validationErrors.lastName ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
                  }`}
                  placeholder="Last name"
                />
                {validationErrors.lastName && (
                  <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={tenantData.email || ''}
                onChange={(e) => {
                  setTenantData({ ...tenantData, email: e.target.value });
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                  validationErrors.email ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
                }`}
                placeholder="email@example.com"
              />
              {validationErrors.email && (
                <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={tenantData.phone || ''}
                onChange={(e) => {
                  const sanitized = validation.sanitizePhone(e.target.value);
                  setTenantData({ ...tenantData, phone: sanitized });
                  if (validationErrors.phone) {
                    setValidationErrors({ ...validationErrors, phone: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                  validationErrors.phone ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
                }`}
                placeholder="+54 11 23456789"
              />
              {validationErrors.phone && (
                <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Government ID *
              </label>
              <input
                type="text"
                value={tenantData.documentNumber || ''}
                onChange={(e) => {
                  const sanitized = validation.sanitizeDocumentNumber(e.target.value);
                  setTenantData({ ...tenantData, documentNumber: sanitized });
                  if (validationErrors.documentNumber) {
                    setValidationErrors({ ...validationErrors, documentNumber: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                  validationErrors.documentNumber ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
                }`}
                placeholder="11223344"
              />
              {validationErrors.documentNumber && (
                <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.documentNumber}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAssignUnit} className="p-6 space-y-4">
            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Property *
              </label>
              <select
                value={assignmentData.propertyId}
                onChange={(e) => {
                  setAssignmentData({ ...assignmentData, propertyId: e.target.value, unitId: '' });
                }}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white"
              >
                <option value="" className="bg-black">
                  Select a property
                </option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id} className="bg-black">
                    {prop.name}
                  </option>
                ))}
              </select>
            </div>

            {assignmentData.propertyId && (
              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Unit *
                </label>
                <select
                  value={assignmentData.unitId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, unitId: e.target.value })}
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white"
                >
                  <option value="" className="bg-black">
                    Select a unit
                  </option>
                  {availableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id} className="bg-black">
                      Unit {unit.unitNumber} — {unit.type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {assignmentData.propertyId && assignmentData.unitId && (() => {
              const selectedUnit = availableUnits.find(u => u.id === assignmentData.unitId);
              return selectedUnit ? (
                <div className="p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[8px]">
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Monthly rent
                  </label>
                  <p className="text-white font-semibold text-lg">
                    ${selectedUnit.rentAmount.toLocaleString()}
                  </p>
                </div>
              ) : null;
            })()}

            <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
              <button
                type="button"
                onClick={() => {
                  setStep('info');
                  setNewTenant(null);
                }}
                className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSkipAssignment}
                className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Create without assigning
              </button>
              <button
                type="submit"
                disabled={!assignmentData.propertyId || !assignmentData.unitId}
                className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign tenant
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
