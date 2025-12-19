"use client";

import { deleteSubcategory } from "@/lib/actions/subcategories";
import FormButton from "@/components/buttons/form-button";
import { FormEvent, useState } from "react";
import { formatErrorMessage } from "@/lib/utils/subcategories";

export default function DeleteSubcategoryButton({
  subcategoryId,
  categoryId,
}: {
  subcategoryId: string;
  categoryId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    setIsDeleting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData(e.currentTarget);
      const response = await deleteSubcategory(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Subcategory deleted successfully!",
        });
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
      <form onSubmit={handleDelete} className="inline">
        <input type="hidden" name="id" value={subcategoryId} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <FormButton
          type="submit"
          label={isDeleting ? "Deleting..." : "Delete"}
          variant="delete"
          size="md"
          disabled={isDeleting}
        />
      </form>
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
