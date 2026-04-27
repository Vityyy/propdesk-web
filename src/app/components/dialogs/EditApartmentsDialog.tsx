import { ApartmentFormDialog } from './ApartmentFormDialog';
import { EditApartmentTabsDialog } from './EditApartmentTabsDialog';
import userService, { ApartmentGridResponse } from '../../../services/userService';

interface EditApartmentsDialogProps {
  isOpen: boolean;
  propertyId: string;
  apartments: ApartmentGridResponse[];
  initialSection?: 'data' | 'tenant' | 'expenses' | null;
  onClose: () => void;
  onSuccess?: (result?: { apartmentId: string; changes: Partial<ApartmentGridResponse> }) => void;
}

export function EditApartmentsDialog({ isOpen, propertyId, apartments, initialSection = null, onClose, onSuccess }: EditApartmentsDialogProps) {
  const isBulk = apartments.length > 1;

  // Single apartment: use the new tabs dialog
  if (!isBulk && apartments.length === 1) {
    return (
      <EditApartmentTabsDialog
        isOpen={isOpen}
        propertyId={propertyId}
        apartment={apartments[0]}
        initialSection={initialSection}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  // Bulk edit: use the old simple form
  const handleSubmit = async (formData: { rent: string, squareMeters: string }) => {
    if (apartments.length === 0) return;

    const updates: { rent?: number; squareMeters?: number } = {};
    if (formData.rent) updates.rent = parseFloat(formData.rent);
    if (formData.squareMeters) updates.squareMeters = parseFloat(formData.squareMeters);

    await userService.bulkUpdateApartments({
      apartmentIds: apartments.map(a => a.id),
      ...updates,
    });
    onSuccess?.();
  };

  return (
    <ApartmentFormDialog
      isOpen={isOpen}
      title="Bulk Edit"
      description={`Editing ${apartments.length} selected apartments`}
      initialRent=""
      initialSquareMeters=""
      isBulk={true}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Save Changes"
      submittingText="Saving..."
    />
  );
}
