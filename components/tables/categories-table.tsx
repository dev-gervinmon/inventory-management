"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useMessage } from "@/lib/hooks/useMessage";
import { useSelection } from "@/lib/hooks/useSelection";
import { deleteBulkCategories } from "@/lib/actions/categories";
import { formatCategoryDate } from "@/lib/utils/categories";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import FormButton from "@/components/buttons/form-button";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  subcategories: Array<{ id: string }>;
  _count: {
    products: number;
  };
}

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const { showSuccess, showError } = useMessage();
  const [isPending, startTransition] = useTransition();
  const { selectedIds, selectAll, deselectAll, toggle, isSelected, count } =
    useSelection();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(categories.map((c) => c.id));
    } else {
      deselectAll();
    }
  };

  const handleDeleteSelected = async () => {
    if (count === 0) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        selectedIds.forEach((id) => formData.append("ids", id));

        const result = await deleteBulkCategories(formData);

        if (!result.success) {
          showError(result.error || "Failed to delete categories");
          return;
        }

        showSuccess(
          `${result.deletedCount} category(ies) deleted successfully`
        );
        deselectAll();
        setShowConfirm(false);

        // Reload page to get fresh data
        window.location.reload();
      } catch (error) {
        showError("An error occurred while deleting categories");
      }
    });
  };

  return (
    <>
      {count > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {count} categor{count === 1 ? "y" : "ies"} selected
          </span>
          <FormButton
            type="button"
            label={`Delete Selected (${count})`}
            variant="delete"
            size="sm"
            disabled={isPending}
            onClick={() => setShowConfirm(true)}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  id="select-all"
                  className="w-4 h-4 cursor-pointer"
                  checked={categories.length > 0 && count === categories.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Products
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Subcategories
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={isSelected(category.id)}
                    onChange={(e) => toggle(category.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    {category.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {category._count.products}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {category.subcategories.length}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatCategoryDate(category.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteSelected}
        title="Delete Categories"
        message={`Are you sure you want to delete ${count} categor${
          count === 1 ? "y" : "ies"
        }? This action cannot be undone.`}
        isLoading={isPending}
      />
    </>
  );
}
