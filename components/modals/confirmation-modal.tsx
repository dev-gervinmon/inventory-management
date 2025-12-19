"use client";

import CloseButton from "@/components/buttons/close-button";
import FormButton from "@/components/buttons/form-button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/10 z-9999 transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-10000 
                   transform transition-transform duration-700 ease-in-out overflow-hidden"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <CloseButton onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <FormButton
              type="button"
              onClick={handleConfirm}
              label={isLoading ? "Deleting..." : confirmLabel}
              disabled={isLoading}
              variant="delete"
              className="flex-1"
            />
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg
                       hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       font-medium transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
