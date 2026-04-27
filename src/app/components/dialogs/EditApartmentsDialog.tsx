import { ApartmentFormDialog } from './ApartmentFormDialog';
import userService, { ApartmentGridResponse } from '../../../services/userService';

interface EditApartmentsDialogProps {
  isOpen: boolean;
  apartments: ApartmentGridResponse[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditApartmentsDialog({ isOpen, apartments, onClose, onSuccess }: EditApartmentsDialogProps) {
  const isBulk = apartments.length > 1;

  const handleSubmit = async (formData: { rent: string, squareMeters: string }) => {
    if (apartments.length === 0) return;

    const updates: { rent?: number; squareMeters?: number } = {};
    if (formData.rent) updates.rent = parseFloat(formData.rent);
    if (formData.squareMeters) updates.squareMeters = parseFloat(formData.squareMeters);

    if (isBulk) {
      await userService.bulkUpdateApartments({
        apartmentIds: apartments.map(a => a.id),
        ...updates,
      });
    } else {
      await userService.updateApartment(apartments[0].id, updates);
    }
    onSuccess?.();
  };

  return (
    <ApartmentFormDialog
      isOpen={isOpen}
      title={isBulk ? 'Bulk Edit' : 'Edit Apartment'}
      description={isBulk ? `Editing ${apartments.length} selected apartments` : 'Editing data for apartment'}
      initialRent={!isBulk && apartments.length === 1 ? apartments[0].rent?.toString() || '' : ''}
      initialSquareMeters={!isBulk && apartments.length === 1 ? apartments[0].squareMeters?.toString() || '' : ''}
      isBulk={isBulk}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Save Changes"
      submittingText="Saving..."
    />
  );
}
