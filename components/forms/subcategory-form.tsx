"use client";

import { useState } from "react";
import FormButton from "@/components/buttons/form-button";
import DeleteSubcategoryButton from "@/components/buttons/delete/delete-subcategory-button";
import { formatCategoryDate } from "@/lib/utils/categories";
import { useMessage } from "@/lib/hooks/useMessage";
import { UI_TIMING } from "@/lib/constants/forms";
import {
  SUBCATEGORY_LIMITS,
  validateSubcategoryName,
  getInputClassName,
} from "@/lib/utils/subcategories";

interface Subcategory {
  id: string;
  name: string;
  createdAt: Date;
}

export default function SubcategoryForm({
  subcategory,
  categoryId,
  formAction,
}: {
  subcategory: Subcategory;
  categoryId: string;
  formAction: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData(e.currentTarget);
      const response = await formAction(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Subcategory updated successfully!",
        });
        setIsEditing(false);
        setTimeout(
          () => setMessage({ type: "", text: "" }),
          UI_CONSTANTS.MESSAGE_TIMEOUT
        );
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 bg-linear-to-r from-blue-50 to-transparent">
      {isEditing ? (
        <>
          <form onSubmit={handleSave} className="flex-1 flex gap-3 items-end">
            <input type="hidden" name="id" value={subcategory.id} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor={`subcategory-name-${subcategory.id}`}
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
                id={`subcategory-name-${subcategory.id}`}
                type="text"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Subcategory name"
                className={getInputClassName(!!nameError)}
                autoFocus
                maxLength={SUBCATEGORY_LIMITS.NAME_MAX}
                disabled={isSubmitting}
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>
            <FormButton
              type="submit"
              label={isSubmitting ? "Saving..." : "Save"}
              disabled={isSubmitting || !!nameError}
              size="sm"
            />
            <FormButton
              type="button"
              label="Cancel"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setIsEditing(false);
                setName(subcategory.name);
                setNameError("");
                setMessage({ type: "", text: "" });
              }}
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
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {subcategory.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatCategoryDate(subcategory.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <FormButton
                type="button"
                label="Edit"
                variant="edit"
                size="md"
                onClick={() => {
                  setIsEditing(true);
                  setNameError("");
                  setMessage({ type: "", text: "" });
                }}
              />
              <DeleteSubcategoryButton
                subcategoryId={subcategory.id}
                categoryId={categoryId}
                subcategoryName={subcategory.name}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
