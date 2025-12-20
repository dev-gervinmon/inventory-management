"use client";

import { useState, FormEvent } from "react";
import { editCategory } from "@/lib/actions/categories";
import FormButton from "@/components/buttons/form-button";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import { UI_TIMING } from "@/lib/constants/forms";
import { formatErrorMessage } from "@/lib/utils/subcategories";
import { CATEGORY_LIMITS } from "@/lib/utils/categories";

interface EditCategoryFormProps {
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
}

export default function EditCategoryForm({
  categoryId,
  categoryName,
  onSuccess,
}: EditCategoryFormProps) {
  const [name, setName] = useState(categoryName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_TIMING.MESSAGE_TIMEOUT_MS,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      showError("Category name is required");
      return;
    }

    if (name.length > CATEGORY_LIMITS.NAME_MAX) {
      showError(
        `Category name must be ${CATEGORY_LIMITS.NAME_MAX} characters or less`
      );
      return;
    }

    if (name === categoryName) {
      showError("No changes made");
      return;
    }

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", categoryId);
      formData.append("name", name);

      const response = await editCategory(formData);

      if (response.success) {
        showSuccess("Category updated successfully!");
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        showError(response.error || "Failed to update category");
      }
    } catch (error) {
      showError(formatErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearMessage();
          }}
          placeholder="Enter category name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
            message.type === "error"
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500"
          }`}
          maxLength={CATEGORY_LIMITS.NAME_MAX}
          disabled={isSubmitting}
        />
        <div className="flex justify-between mt-2">
          {message.text === "" && (
            <span className="text-xs text-gray-400">
              {name.length}/{CATEGORY_LIMITS.NAME_MAX}
            </span>
          )}
        </div>
      </div>

      <MessageBanner message={message} />

      <div className="flex gap-4 pt-2">
        <FormButton
          type="submit"
          label={isSubmitting ? "Updating..." : "Update Category"}
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </form>
  );
}
