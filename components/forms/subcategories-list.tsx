"use client";

import { useState } from "react";
import SubcategoryTableRow from "./subcategory-table-row";
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

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.size} subcategory(ies) selected
          </span>
          <FormButton
            type="button"
            label={`Delete Selected (${selectedIds.size})`}
            variant="delete"
            size="sm"
            disabled={isDeleting}
            onClick={handleBulkDelete}
          />
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={
                    selectedIds.size === subcategories.length &&
                    selectedIds.size > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                onDoubleClick={(e) => {
                  // Prevent triggering if clicking on checkbox
                  if (
                    (e.target as HTMLElement).closest("input[type='checkbox']")
                  ) {
                    return;
                  }
                  // Find and trigger the modal from the SubcategoryTableRow
                  const nameCell = (
                    e.currentTarget as HTMLElement
                  ).querySelector("[data-edit-trigger]") as HTMLElement;
                  nameCell?.click();
                }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    id={`select-${sub.id}`}
                    checked={selectedIds.has(sub.id)}
                    onChange={(e) => handleSelectOne(sub.id, e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <SubcategoryTableRow
                  subcategory={sub}
                  categoryId={categoryId}
                  formAction={formAction}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
