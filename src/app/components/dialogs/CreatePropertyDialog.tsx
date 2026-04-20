import { useState } from 'react';
import type { Unit } from '../../types/index';
import { propertyService } from '../../../services/propertyService';
import authService from '../../../services/authService';
import userService from '../../../services/userService';
import { useOwner } from '../../context/OwnerContext';

interface CreatePropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePropertyDialog({ isOpen, onClose, onSuccess }: CreatePropertyDialogProps) {
  const { refreshProperties } = useOwner();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    imageUrl: '',
    description: '',
  });
  const [units, setUnits] = useState<Omit<Unit, 'id'>[]>([]);
  const [unitConfig, setUnitConfig] = useState({
    startNumber: '',
    quantity: '',
    type: '',
    squareFeet: '',
    rentAmount: '',
  });

  const generateUnits = () => {
    if (!unitConfig.startNumber || !unitConfig.quantity || !unitConfig.type) {
      alert('Por favor completa todos los campos de configuración');
      return;
    }

    const startNum = parseInt(unitConfig.startNumber);
    const quantity = parseInt(unitConfig.quantity);

    if (isNaN(startNum) || isNaN(quantity) || quantity <= 0) {
      alert('Número inicial y cantidad deben ser números válidos');
      return;
    }

    // Check for duplicates
    const existingNumbers = new Set(units.map(u => u.unitNumber));
    const newNumbers: string[] = [];
    
    for (let i = 0; i < quantity; i++) {
      newNumbers.push(String(startNum + i));
    }

    const duplicates = newNumbers.filter(num => existingNumbers.has(num));
    if (duplicates.length > 0) {
      alert(`Las unidades ${duplicates.join(', ')} ya existen. Por favor elige números diferentes.`);
      return;
    }

    const newUnits: Omit<Unit, 'id'>[] = [];
    for (let i = 0; i < quantity; i++) {
      newUnits.push({
        unitNumber: String(startNum + i),
        type: unitConfig.type,
        squareFeet: parseInt(unitConfig.squareFeet) || 0,
        rentAmount: parseFloat(unitConfig.rentAmount) || 0,
        status: 'vacant',
      });
    }

    setUnits([...units, ...newUnits]);
    setUnitConfig({ startNumber: '', quantity: '', type: '', squareFeet: '', rentAmount: '' });
  };

  const handleRemoveUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const handleRemoveRange = (startIndex: number, count: number) => {
    setUnits(units.filter((_, i) => i < startIndex || i >= startIndex + count));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address) {
      alert('Por favor ingresa nombre y dirección');
      return;
    }

    if (units.length === 0) {
      alert('Por favor agrega al menos una unidad');
      return;
    }

    try {
      const authenticatedOwnerId = authService.getCurrentUserId();
      if (!authenticatedOwnerId) {
        throw new Error('No authenticated owner found');
      }

      const createdProperty = await userService.createProperty({
        ownerId: authenticatedOwnerId,
        name: formData.name,
        address: formData.address,
      });

      const createdApartments = await userService.createApartments(
        units.map((unit) => ({
          name: unit.unitNumber,
          propertyId: createdProperty.id,
          amount_due: unit.rentAmount || 0,
        })),
      );

      const unitsWithBackendIds: Unit[] = units.map((unit, index) => ({
        ...unit,
        id: createdApartments[index].id,
      }));

      propertyService.storeProperty({
        id: createdProperty.id,
        ownerId: authenticatedOwnerId,
        name: createdProperty.name,
        address: createdProperty.address,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x300?text=Property',
        description: formData.description,
        units: unitsWithBackendIds,
        totalUnits: unitsWithBackendIds.length,
        occupiedUnits: unitsWithBackendIds.filter((unit) => unit.status === 'occupied').length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      refreshProperties();
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Error al crear la propiedad');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', address: '', imageUrl: '', description: '' });
    setUnits([]);
    setUnitConfig({ startNumber: '', quantity: '', type: '', squareFeet: '', rentAmount: '' });
    onClose();
  };

  // Group units by configuration for preview
  const groupedUnits = (() => {
    const groups: { units: Omit<Unit, 'id'>[]; index: number }[] = [];
    let currentGroup: { units: Omit<Unit, 'id'>[]; index: number } | null = null;

    units.forEach((unit, idx) => {
      if (!currentGroup) {
        currentGroup = { units: [unit], index: idx };
      } else {
        const lastUnit = currentGroup.units[currentGroup.units.length - 1];
        const currentNum = parseInt(unit.unitNumber);
        const lastNum = parseInt(lastUnit.unitNumber);

        if (lastNum + 1 === currentNum && lastUnit.type === unit.type && lastUnit.rentAmount === unit.rentAmount) {
          currentGroup.units.push(unit);
        } else {
          groups.push(currentGroup);
          currentGroup = { units: [unit], index: idx };
        }
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  })();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between sticky top-0 bg-black">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            Nueva Propiedad
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Info */}
          <div className="space-y-4">
            <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
              Información de la Propiedad
            </h3>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Nombre de la Propiedad
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)]"
                placeholder="ej: Sunset Apartments"
              />
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)]"
                placeholder="ej: 123 Main St, City, State"
              />
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)]"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] resize-none"
                placeholder="Descripción de la propiedad..."
                rows={3}
              />
            </div>
          </div>

          {/* Units Configuration */}
          <div className="space-y-4">
            <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
              Configurar Unidades
            </h3>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[8px] p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Número de Unidad Inicial *
                  </label>
                  <input
                    type="number"
                    value={unitConfig.startNumber}
                    onChange={(e) => setUnitConfig({ ...unitConfig, startNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="ej: 101"
                  />
                </div>
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Cantidad de Unidades *
                  </label>
                  <input
                    type="number"
                    value={unitConfig.quantity}
                    onChange={(e) => setUnitConfig({ ...unitConfig, quantity: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="ej: 10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                  Tipo de Unidad *
                </label>
                <input
                  type="text"
                  value={unitConfig.type}
                  onChange={(e) => setUnitConfig({ ...unitConfig, type: e.target.value })}
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                  placeholder="ej: 2 Dormitorios"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Tamaño (m²)
                  </label>
                  <input
                    type="number"
                    value={unitConfig.squareFeet}
                    onChange={(e) => setUnitConfig({ ...unitConfig, squareFeet: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    Renta Mensual ($)
                  </label>
                  <input
                    type="number"
                    value={unitConfig.rentAmount}
                    onChange={(e) => setUnitConfig({ ...unitConfig, rentAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={generateUnits}
                className="w-full px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors text-sm"
              >
                + Agregar {unitConfig.quantity ? `${unitConfig.quantity} Unidades` : 'Unidades'}
              </button>
            </div>
          </div>

          {/* Units Preview */}
          {units.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-['Archivo:SemiBold',sans-serif] font-semibold text-white">
                Unidades Configuradas ({units.length})
              </h3>

              <div className="space-y-2">
                {groupedUnits.map((group, groupIdx) => {
                  const isMultiple = group.units.length > 1;
                  const firstUnit = group.units[0];
                  const lastUnit = group.units[group.units.length - 1];

                  return (
                    <div
                      key={groupIdx}
                      className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px]"
                    >
                      <div className="flex-1 text-sm">
                        <p className="text-white font-semibold">
                          {isMultiple
                            ? `Unidades ${firstUnit.unitNumber} - ${lastUnit.unitNumber} (${group.units.length})`
                            : `Unidad ${firstUnit.unitNumber}`}
                        </p>
                        <p className="text-[rgba(255,255,255,0.6)]">
                          {firstUnit.type} • {firstUnit.squareFeet}m² • ${firstUnit.rentAmount.toLocaleString()}/mes
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          isMultiple
                            ? handleRemoveRange(group.index, group.units.length)
                            : handleRemoveUnit(group.index)
                        }
                        className="text-[#ff6b6b] hover:text-[#ff5252] transition-colors ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.16)]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[rgba(255,255,255,0.16)] text-white rounded-[8px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={units.length === 0}
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Propiedad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
