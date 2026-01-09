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
import type { DrawerCategory } from "@/components/page-specific/categories/category-drawer";

interface CategoriesTableProps {
  categories: DrawerCategory[];
  visibleColumns: ColumnVisibility[];
  onOpenCategory?: (categoryId: string) => void;
  onCategoriesChange?: React.Dispatch<React.SetStateAction<DrawerCategory[]>>;
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
      bgColor: "bg-(--danger)/10 border border-(--danger)/20",
      textColor: "text-(--danger)",
    };
  } else if (count < 5) {
    return {
      label: "Low",
      bgColor: "bg-(--warning)/10 border border-(--warning)/20",
      textColor: "text-(--warning)",
    };
  } else {
    return {
      label: "Healthy",
      bgColor: "bg-(--success)/10 border border-(--success)/20",
      textColor: "text-(--success)",
    };
  }
}

export default function CategoriesTable({
  categories,
  visibleColumns,
  onOpenCategory,
  onCategoriesChange,
}: CategoriesTableProps) {
  const { showError } = useMessage();
  const [isPending, startTransition] = useTransition();
  const { push: navigateTo } = useNavigationTransition();
  const { selectedIds, selectAll, deselectAll, toggle, isSelected, count } =
    useSelection();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
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

  // Cleanup timeout on unmount and listen for new categories
  React.useEffect(() => {
    return () => {
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
        const updatedCategories = categories.filter(
          (cat) => !selectedIds.has(cat.id)
        );
        onCategoriesChange?.(updatedCategories);
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
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-(--text-muted) pointer-events-none"
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
            className="w-full pl-10 sm:pl-12 pr-10 py-2.5 text-sm rounded-xl transition bg-(--surface-elevated)/30 text-(--text-primary) placeholder:text-(--text-muted) border border-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:border-(--border-strong)"
          />
          {searchQuery && (
            <button
              onClick={() => clearSearch()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary) transition"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-glass rounded-xl border border-(--border-subtle) px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-(--brand) shrink-0"
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
            <span className="text-xs sm:text-sm text-(--text-secondary) font-medium">
              Found <strong>{sortedCategories.length}</strong> of{" "}
              <strong>{categories.length}</strong> categor
              {categories.length !== 1 ? "ies" : "y"} matching &quot;
              <strong className="text-(--brand)">{searchQuery}</strong>&quot;
            </span>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 sm:p-3 bg-(--info)/10 rounded-xl border border-(--info)/20 gap-2">
          <span className="text-xs sm:text-sm font-medium text-(--info) py-1 sm:py-0">
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

      <div className="overflow-x-auto border border-(--border-subtle) rounded-2xl bg-glass">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-(--surface-elevated)/30 border-b border-(--border-subtle)">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left">
                <input
                  type="checkbox"
                  id="select-all"
                  className="w-4 h-4 cursor-pointer accent-(--brand) rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
                onClick={() => {
                  if (onOpenCategory) {
                    onOpenCategory(category.id);
                    return;
                  }
                  navigateTo(`/categories/${category.id}`);
                }}
                className={`border-b border-(--border-subtle) hover:bg-(--surface-elevated)/20 transition-colors cursor-pointer ${
                  isSelected(category.id) ? "bg-(--surface-elevated)/30" : ""
                }`}
              >
                <td
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer accent-(--brand) rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    checked={isSelected(category.id)}
                    onChange={() => toggle(category.id)}
                  />
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                  <span className="text-xs sm:text-sm font-semibold text-(--text-primary) hover:underline transition">
                    {category.name}
                  </span>
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
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm text-(--text-secondary)">
                    {category.subcategories.length}
                  </td>
                )}
                {showCreatedColumn && (
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm text-(--text-muted)">
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
