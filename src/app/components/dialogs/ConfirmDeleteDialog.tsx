import { useState } from 'react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDeleteDialog({
  isOpen,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#ff6b6b]/30 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center mb-4 text-[#ff6b6b]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-xl text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-[rgba(255,255,255,0.7)]">
            {description}
          </p>
        </div>

        <div className="p-6 mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 border border-[rgba(255,255,255,0.1)] text-white rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50 font-semibold"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-[#ff6b6b] text-black font-bold rounded-xl hover:bg-[#ff5252] transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
