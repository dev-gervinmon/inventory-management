"use client";

import { useState, FormEvent } from "react";
import { createCategory } from "@/lib/actions/categories";
import FormButton from "@/components/buttons/form-button";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import { UI_TIMING } from "@/lib/constants/forms";
import { formatErrorMessage } from "@/lib/utils/subcategories";
import { CATEGORY_LIMITS } from "@/lib/utils/categories";

export default function CategoryForm() {
  const [name, setName] = useState("");
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

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("name", name);

      const response = await createCategory(formData);

      if (response.success) {
        setName("");
        showSuccess("Category created successfully!");

        // Dispatch custom event with the new category data
        if (response.data) {
          const event = new CustomEvent("categoryCreated", {
            detail: response.data,
          });
          window.dispatchEvent(event);
        }
      } else {
        showError(response.error || "Failed to create category");
      }
    } catch (error) {
      showError(formatErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:border-transparent transition ${
            message.type === "error"
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500"
          }`}
          maxLength={CATEGORY_LIMITS.NAME_MAX}
          disabled={isSubmitting}
        />
        <div className="flex justify-between mt-1.5 sm:mt-2">
          {message.text === "" && (
            <span className="text-xs text-gray-400">
              {name.length}/{CATEGORY_LIMITS.NAME_MAX}
            </span>
          )}
        </div>
      </div>

      <MessageBanner message={message} />

      <div className="flex gap-2 sm:gap-4 pt-2 sm:pt-4">
        <FormButton
          type="submit"
          label={isSubmitting ? "Creating..." : "Create Category"}
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </form>
  );
}
