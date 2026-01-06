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
      {/* Overlay - blocks all interactions */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-glass rounded-2xl shadow-2xl border border-(--border-strong) text-(--text-primary) p-6 relative animate-in fade-in zoom-in-95 duration-300 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              id="confirmation-modal-title"
              className="text-base sm:text-lg font-semibold text-(--text-primary)"
            >
              {title}
            </h2>
            <CloseButton onClick={onClose} />
          </div>

          {/* Content */}
          <p className="text-(--text-secondary) text-sm leading-relaxed mb-6">
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
            <FormButton
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
              label="Cancel"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </>
  );
}
