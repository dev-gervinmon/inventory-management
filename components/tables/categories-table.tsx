"use client";

import React, {
  useState,
  useTransition,
  useRef,
  useSyncExternalStore,
} from "react";
import { useNavigationTransition } from "@/lib/contexts/navigation-transition-context";
import { useMessage } from "@/lib/hooks/useMessage";
import { useSelection } from "@/lib/hooks/useSelection";
import { useSearch } from "@/lib/hooks/useSearch";
import { usePagination } from "@/lib/hooks/usePagination";
import { useSort } from "@/lib/hooks/useSort";
import { type ColumnVisibility } from "@/lib/hooks/useColumnVisibility";
import { deleteBulkCategories } from "@/lib/actions/categories";
import { formatCategoryDate } from "@/lib/utils/categories";
import { UI_TIMING } from "@/lib/constants/forms";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import SuccessModal from "@/components/modals/success-modal";
import FormButton from "@/components/buttons/form-button";
import SortableHeader from "@/components/common/sortable-header";
import Pagination from "@/components/common/pagination";

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
  visibleColumns: ColumnVisibility[];
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

export default function CategoriesTable({
  categories,
  visibleColumns,
}: CategoriesTableProps) {
  const { showError } = useMessage();
  const [isPending, startTransition] = useTransition();
  const { push: navigateTo } = useNavigationTransition();
  const { selectedIds, selectAll, deselectAll, toggle, isSelected, count } =
    useSelection();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [displayCategories, setDisplayCategories] = useState(categories);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useSyncExternalStore to safely check visible columns without hydration mismatch
  // Server always returns false for optional columns, client uses actual visibleColumns
  const showSubcategoriesColumn = useSyncExternalStore(
    () => () => {},
    () => !!visibleColumns.find((col) => col.id === "subcategories")?.visible,
    () => false
  );

  const showCreatedColumn = useSyncExternalStore(
    () => () => {},
    () => !!visibleColumns.find((col) => col.id === "created")?.visible,
    () => false
  );

  // Search hook
  const {
    searchQuery,
    setSearch,
    clearSearch,
    filteredItems: filteredCategories,
  } = useSearch(displayCategories, { searchableFields: ["name"] });

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

  // Cleanup timeout on unmount and listen for new categories
  React.useEffect(() => {
    // Handle new category creation
    const handleCategoryCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newCategory = customEvent.detail;

      // Add new category to the top of the list
      setDisplayCategories((prev) => [newCategory, ...prev]);
    };

    window.addEventListener("categoryCreated", handleCategoryCreated);

    return () => {
      window.removeEventListener("categoryCreated", handleCategoryCreated);
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

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

        // Remove deleted categories from display
        const updatedCategories = displayCategories.filter(
          (cat) => !selectedIds.has(cat.id)
        );
        setDisplayCategories(updatedCategories);
        setDeletedCount(result.deletedCount || count);

        // Show success modal
        setShowConfirm(false);
        setShowDeleteSuccess(true);
        deselectAll();

        // Auto-close modal after delay
        successTimeoutRef.current = setTimeout(() => {
          setShowDeleteSuccess(false);
        }, UI_TIMING.DELETE_SUCCESS_MODAL_DELAY_MS);
      } catch {
        showError("An error occurred while deleting categories");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
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
            className="w-full pl-10 sm:pl-12 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 shrink-0"
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
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Found <strong>{sortedCategories.length}</strong> of{" "}
              <strong>{categories.length}</strong> categor
              {categories.length !== 1 ? "ies" : "y"} matching &quot;
              <strong className="text-purple-700">{searchQuery}</strong>&quot;
            </span>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 gap-2">
          <span className="text-xs sm:text-sm font-medium text-blue-900 py-1 sm:py-0">
            {count} categor{count === 1 ? "y" : "ies"} selected
          </span>
          <FormButton
            type="button"
            label={`Delete (${count})`}
            variant="delete"
            size="sm"
            disabled={isPending}
            onClick={() => setShowConfirm(true)}
            className="w-full sm:w-auto"
          />
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left">
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
                label="Name"
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
              {showSubcategoriesColumn && (
                <SortableHeader
                  label="Subcategories"
                  sortKey="subcategories"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
              )}
              {showCreatedColumn && (
                <SortableHeader
                  label="Created"
                  sortKey="createdAt"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={isSelected(category.id)}
                    onChange={() => toggle(category.id)}
                  />
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                  <button
                    onClick={() => navigateTo(`/categories/${category.id}`)}
                    className="text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition cursor-pointer text-left"
                  >
                    {category.name}
                  </button>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                  {(() => {
                    const status = getProductStatus(category._count.products);
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                      >
                        {category._count.products}
                        <span className="hidden sm:inline text-xs">
                          ({status.label})
                        </span>
                      </span>
                    );
                  })()}
                </td>
                {showSubcategoriesColumn && (
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-700">
                    {category.subcategories.length}
                  </td>
                )}
                {showCreatedColumn && (
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600">
                    {formatCategoryDate(category.createdAt)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {sortedCategories.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsStart={startIndex + 1}
          itemsEnd={Math.min(endIndex, sortedCategories.length)}
          totalItems={sortedCategories.length}
          entityName="categories"
        />
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

      <SuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Categories Deleted"
        subtitle={`${deletedCount} categor${
          deletedCount === 1 ? "y" : "ies"
        } deleted successfully`}
      />
    </div>
  );
}
