"use client";

import { useState, FormEvent } from "react";
import { createSubcategory } from "@/lib/actions/subcategories";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import {
  SUBCATEGORY_LIMITS,
  UI_CONSTANTS,
  validateSubcategoryName,
  formatErrorMessage,
} from "@/lib/utils/subcategories";

export default function AddSubcategoryForm({
  categoryId,
}: {
  categoryId: string;
}) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_CONSTANTS.MESSAGE_TIMEOUT,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateSubcategoryName(name);
    if (error) {
      showError(error);
      return;
    }

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", categoryId);

      const response = await createSubcategory(formData);

      if (response.success) {
        setName("");
        showSuccess("Subcategory added successfully!");
      } else {
        showError(response.error || "Failed to add subcategory");
      }
    } catch (error) {
      showError(formatErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="new-subcategory"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subcategory Name *
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="new-subcategory"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearMessage();
              }}
              placeholder="e.g., Winter Jackets"
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                message.type === "error"
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              maxLength={SUBCATEGORY_LIMITS.NAME_MAX}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 whitespace-nowrap cursor-pointer disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
          <MessageBanner message={message} />
          <div className="flex justify-between mt-2">
            {message.text === "" && (
              <span className="text-xs text-gray-400">
                {name.length}/{SUBCATEGORY_LIMITS.NAME_MAX}
              </span>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
