import { useState, useEffect } from 'react';
import type { Property } from '../../types/index';
import { propertyService } from '../../../services/propertyService';

interface EditPropertyDialogProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditPropertyDialog({ isOpen, property, onClose, onSuccess }: EditPropertyDialogProps) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    description: property?.description || '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Actualizar formulario cuando la propiedad cambia
  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        description: property.description || '',
      });
      setValidationErrors({});
    }
  }, [property?.id, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'El nombre es requerido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !property) {
      return;
    }

    try {
      propertyService.updateProperty(property.id, {
        name: formData.name,
        description: formData.description,
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error al actualizar la propiedad');
    }
  };

  const handleClose = () => {
    setFormData({
      name: property?.name || '',
      description: property?.description || '',
    });
    setValidationErrors({});
    onClose();
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-[16px] max-w-2xl w-full">
        <div className="p-6 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
          <h2 className="font-['Archivo:ExtraBold',sans-serif] font-extrabold text-[20px] text-white">
            Editar Propiedad
          </h2>
          <button
            onClick={handleClose}
            className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: '' });
                }
              }}
              className={`w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)] ${
                validationErrors.name ? 'border-[#FF6B6B]' : 'border-[rgba(255,255,255,0.16)]'
              }`}
              placeholder="Nombre de la propiedad"
            />
            {validationErrors.name && (
              <p className="text-[#FF6B6B] text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[rgba(255,255,255,0.7)] text-sm mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.16)] rounded-[8px] text-white placeholder-[rgba(255,255,255,0.4)]"
              placeholder="Detalles sobre la propiedad..."
              rows={4}
            />
          </div>

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
              className="flex-1 px-4 py-2 bg-[#928dd3] text-black font-semibold rounded-[8px] hover:bg-[#a89be6] transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
