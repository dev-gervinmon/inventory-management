"use client";

import { useState } from "react";
import FormButton from "@/components/buttons/form-button";
import CloseButton from "@/components/buttons/close-button";
import {
  SUBCATEGORY_LIMITS,
  UI_CONSTANTS,
  validateSubcategoryName,
  getInputClassName,
} from "@/lib/utils/subcategories";

interface EditSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcategory: {
    id: string;
    name: string;
  };
  categoryId: string;
  formAction: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function EditSubcategoryModal({
  isOpen,
  onClose,
  subcategory,
  categoryId,
  formAction,
}: EditSubcategoryModalProps) {
  const [name, setName] = useState(subcategory.name);
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateSubcategoryName(value));
    setMessage({ type: "", text: "" });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nameError) {
      setMessage({
        type: "error",
        text: "Please fix the errors above",
      });
      return;
    }

    if (name === subcategory.name) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("id", subcategory.id);
      formData.append("name", name);
      formData.append("categoryId", categoryId);

      const response = await formAction(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Subcategory updated successfully!",
        });
        setTimeout(() => {
          onClose();
          setName(subcategory.name);
          setNameError("");
          setMessage({ type: "", text: "" });
        }, UI_CONSTANTS.MESSAGE_TIMEOUT);
      } else {
        setMessage({
          type: "error",
          text: response.error || "Failed to update subcategory",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(subcategory.name);
    setNameError("");
    setMessage({ type: "", text: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Very Light Overlay with Smooth Fade Animation */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-700 ${
          isOpen ? "opacity-10" : "opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
        onClick={handleCancel}
      />

      {/* Smooth Slide-in Panel from Right with Elegant Animation */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-all duration-700 overflow-y-auto ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-96 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Subcategory
          </h2>
          <CloseButton onClick={handleCancel} variant="gray" size="md" />
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="edit-subcategory-name"
                className="text-sm font-medium text-gray-700"
              >
                Subcategory Name
              </label>
              <span
                className={`text-xs ${
                  name.length > SUBCATEGORY_LIMITS.NAME_MAX
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {name.length}/{SUBCATEGORY_LIMITS.NAME_MAX}
              </span>
            </div>
            <input
              id="edit-subcategory-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter subcategory name"
              className={getInputClassName(!!nameError)}
              autoFocus
              maxLength={SUBCATEGORY_LIMITS.NAME_MAX}
              disabled={isSubmitting}
            />
            {nameError && <p className="text-xs text-red-500">{nameError}</p>}
          </div>

          {message.text && (
            <div
              className={`text-sm p-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <FormButton
              type="submit"
              label={isSubmitting ? "Saving..." : "Save"}
              disabled={isSubmitting || !!nameError}
              className="flex-1"
            />
            <FormButton
              type="button"
              label="Cancel"
              variant="secondary"
              disabled={isSubmitting}
              onClick={handleCancel}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </>
  );
}
