"use client";

import { deleteCategory } from "@/lib/actions/categories";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import { useState } from "react";
import { formatErrorMessage } from "@/lib/utils/subcategories";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
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
      formData.append("id", categoryId);

      const response = await deleteCategory(formData);

      if (response.success) {
        showSuccess("Category deleted successfully!");
        setIsModalOpen(false);
      } else {
        showError(response.error || "Failed to delete category");
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
        label="Delete Category"
        variant="delete"
        size="md"
        disabled={isDeleting}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryName}"? All subcategories will also be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
      <MessageBanner message={message} />
    </div>
  );
}
