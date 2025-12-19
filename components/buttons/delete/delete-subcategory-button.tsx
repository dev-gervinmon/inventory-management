"use client";

import { deleteSubcategory } from "@/lib/actions/subcategories";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import { useState } from "react";
import { formatErrorMessage } from "@/lib/utils/subcategories";

export default function DeleteSubcategoryButton({
  subcategoryId,
  categoryId,
  subcategoryName,
}: {
  subcategoryId: string;
  categoryId: string;
  subcategoryName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: false,
  });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", subcategoryId);
      formData.append("categoryId", categoryId);

      const response = await deleteSubcategory(formData);

      if (response.success) {
        showSuccess("Subcategory deleted successfully!");
        setIsModalOpen(false);
      } else {
        showError(response.error || "Failed to delete subcategory");
      }
    } catch (error) {
      showError(formatErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FormButton
        type="button"
        onClick={() => setIsModalOpen(true)}
        label="Delete"
        variant="delete"
        size="md"
        disabled={isDeleting}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${subcategoryName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
      <MessageBanner message={message} />
    </div>
  );
}
