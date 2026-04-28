import { ApartmentFormDialog } from './ApartmentFormDialog';
import userService from '../../../services/userService';

interface AddSingleApartmentDialogProps {
  isOpen: boolean;
  propertyId: string;
  floor: number;
  nextNumber: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddSingleApartmentDialog({ isOpen, propertyId, floor, nextNumber, onClose, onSuccess }: AddSingleApartmentDialogProps) {
  const handleSubmit = async (formData: { rent: string, squareMeters: string }) => {
    await userService.addSingleApartment({
      propertyId,
      floor,
      number: nextNumber,
      rent: parseFloat(formData.rent),
      squareMeters: parseFloat(formData.squareMeters),
    });
    onSuccess?.();
  };

  return (
    <ApartmentFormDialog
      isOpen={isOpen}
      title="Add Apartment"
      description={`Adding APT ${nextNumber} to Floor ${floor}`}
      isAddMode={true}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Add Apartment"
      submittingText="Adding..."
    />
  );
}
