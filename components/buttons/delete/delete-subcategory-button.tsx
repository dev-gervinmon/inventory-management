"use client";

import { deleteSubcategory } from "@/lib/actions/subcategories";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
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
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("id", subcategoryId);
      formData.append("categoryId", categoryId);

      const response = await deleteSubcategory(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Subcategory deleted successfully!",
        });
        setIsModalOpen(false);
      } else {
        setMessage({
          type: "error",
          text: response.error || "Failed to delete subcategory",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: formatErrorMessage(error),
      });
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
      {message.text && (
        <div
          className={`text-sm p-2 rounded-lg ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
