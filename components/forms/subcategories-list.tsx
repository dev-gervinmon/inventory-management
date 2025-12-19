"use client";

import { useState } from "react";
import SubcategoryForm from "./subcategory-form";
import FormButton from "@/components/buttons/form-button";
import { deleteBulkSubcategories } from "@/lib/actions/subcategories";
import { UI_CONSTANTS } from "@/lib/utils/subcategories";

interface Subcategory {
  id: string;
  name: string;
  createdAt: Date;
}

interface SubcategoriesListProps {
  subcategories: Subcategory[];
  categoryId: string;
  formAction: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function SubcategoriesList({
  subcategories,
  categoryId,
  formAction,
}: SubcategoriesListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(subcategories.map((sub) => sub.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one subcategory to delete",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} subcategory(ies)? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      selectedIds.forEach((id) => formData.append("ids", id));
      formData.append("categoryId", categoryId);

      const response = await deleteBulkSubcategories(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: `Successfully deleted ${response.deletedCount} subcategory(ies)!`,
        });
        setSelectedIds(new Set());
        setTimeout(
          () => setMessage({ type: "", text: "" }),
          UI_CONSTANTS.MESSAGE_TIMEOUT
        );
      } else {
        setMessage({
          type: "error",
          text: response.error || "Failed to delete subcategories",
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
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {subcategories.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="select-all"
            checked={
              selectedIds.size === subcategories.length && selectedIds.size > 0
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium text-gray-700 flex-1 cursor-pointer"
          >
            Select All ({selectedIds.size}/{subcategories.length})
          </label>
          {selectedIds.size > 0 && (
            <FormButton
              type="button"
              label={`Delete Selected (${selectedIds.size})`}
              variant="delete"
              size="sm"
              disabled={isDeleting}
              onClick={handleBulkDelete}
            />
          )}
        </div>
      )}

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

      <div className="space-y-3">
        {subcategories.map((sub) => (
          <div key={sub.id} className="flex gap-3 items-start">
            <input
              type="checkbox"
              id={`select-${sub.id}`}
              checked={selectedIds.has(sub.id)}
              onChange={(e) => handleSelectOne(sub.id, e.target.checked)}
              className="w-4 h-4 mt-4 cursor-pointer"
            />
            <div className="flex-1">
              <SubcategoryForm
                subcategory={sub}
                categoryId={categoryId}
                formAction={formAction}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
