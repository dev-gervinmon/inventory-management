"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useMessage } from "@/lib/hooks/useMessage";
import { useSelection } from "@/lib/hooks/useSelection";
import { useSearch } from "@/lib/hooks/useSearch";
import { usePagination } from "@/lib/hooks/usePagination";
import { useSort } from "@/lib/hooks/useSort";
import { deleteBulkCategories } from "@/lib/actions/categories";
import { formatCategoryDate } from "@/lib/utils/categories";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import FormButton from "@/components/buttons/form-button";
import SortableHeader from "@/components/common/sortable-header";

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

const ITEMS_PER_PAGE = 10;

// Determine product status based on count
function getProductStatus(count: number): {
  label: string;
  bgColor: string;
  textColor: string;
} {
  if (count === 0) {
    return {
      label: "Empty",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    };
  } else if (count < 5) {
    return {
      label: "Low",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
    };
  } else {
    return {
      label: "Healthy",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    };
  }
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const { showSuccess, showError } = useMessage();
  const [isPending, startTransition] = useTransition();
  const { selectedIds, selectAll, deselectAll, toggle, isSelected, count } =
    useSelection();

  const [showConfirm, setShowConfirm] = useState(false);

  // Search hook
  const {
    searchQuery,
    setSearch,
    clearSearch,
    filteredItems: filteredCategories,
  } = useSearch(categories, { searchableFields: ["name"] });

  // Sort hook
  const {
    sortKey,
    sortDirection,
    toggleSort,
    sortedItems: sortedCategories,
  } = useSort({
    items: filteredCategories,
    initialSortKey: "createdAt",
    initialDirection: "desc",
  });

  // Pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedCategories,
    startIndex,
    endIndex,
  } = usePagination(sortedCategories, { itemsPerPage: ITEMS_PER_PAGE });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(sortedCategories.map((c) => c.id));
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
      } catch {
        showError("An error occurred while deleting categories");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => clearSearch()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs text-gray-700 font-medium">
              Found <strong>{sortedCategories.length}</strong> of{" "}
              <strong>{categories.length}</strong> categor
              {categories.length !== 1 ? "ies" : "y"} matching &quot;
              <strong className="text-purple-700">{searchQuery}</strong>&quot;
            </span>
          </div>
        </div>
      )}

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

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  id="select-all"
                  className="w-4 h-4 cursor-pointer"
                  checked={
                    sortedCategories.length > 0 &&
                    count === sortedCategories.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <SortableHeader
                label="Category Name"
                sortKey="name"
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Products"
                sortKey="_count.products"
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Subcategories"
                sortKey="subcategories"
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Created"
                sortKey="createdAt"
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={isSelected(category.id)}
                    onChange={() => toggle(category.id)}
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
                  {(() => {
                    const status = getProductStatus(category._count.products);
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                      >
                        {category._count.products}
                        <span className="text-xs">({status.label})</span>
                      </span>
                    );
                  })()}
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

      {/* Pagination Controls */}
      {sortedCategories.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, sortedCategories.length)} of{" "}
            {sortedCategories.length} categories
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition cursor-pointer"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:scale-105"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}
