"use client";

import { useState } from "react";
import SubcategoryTableRow from "../tables/subcategory-table-row";
import EditSubcategoryModal from "../modals/edit-subcategory-modal";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import MessageBanner from "@/components/common/message-banner";
import Pagination from "@/components/common/pagination";
import { deleteBulkSubcategories } from "@/lib/actions/subcategories";
import { useMessage } from "@/lib/hooks/useMessage";
import { usePagination } from "@/lib/hooks/usePagination";
import { useSearch } from "@/lib/hooks/useSearch";
import { useSelection } from "@/lib/hooks/useSelection";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/common/sortable-header";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_CONSTANTS.MESSAGE_TIMEOUT,
  });

  // Search hook
  const {
    searchQuery,
    setSearch,
    clearSearch,
    filteredItems: filteredSubcategories,
  } = useSearch(subcategories, { searchableFields: ["name"] });

  // Sort hook
  const {
    sortKey,
    sortDirection,
    toggleSort,
    sortedItems: sortedSubcategories,
  } = useSort({
    items: filteredSubcategories,
    initialSortKey: "createdAt",
    initialDirection: "desc",
  });

  // Pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedSubcategories,
    startIndex,
    endIndex,
  } = usePagination(sortedSubcategories, { itemsPerPage: 10 });

  // Selection hook
  const { selectedIds, toggle, selectAll, deselectAll, count } = useSelection();

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(sortedSubcategories.map((sub) => sub.id));
    } else {
      deselectAll();
    }
  };

  const handleSelectOne = (id: string) => {
    toggle(id);
  };

  const handleBulkDelete = async () => {
    if (count === 0) {
      showError("Please select at least one subcategory to delete");
      return;
    }

    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    clearMessage();

    try {
      const formData = new FormData();
      Array.from(selectedIds).forEach((id) => formData.append("ids", id));
      formData.append("categoryId", categoryId);

      const response = await deleteBulkSubcategories(formData);

      if (response.success) {
        showSuccess(
          `Successfully deleted ${response.deletedCount} subcategory(ies)!`
        );
        deselectAll();
        setIsBulkDeleteModalOpen(false);
      } else {
        showError(response.error || "Failed to delete subcategories");
      }
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <MessageBanner message={message} />

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
            placeholder="Search subcategories..."
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
              Found <strong>{sortedSubcategories.length}</strong> of{" "}
              <strong>{subcategories.length}</strong> subcategor
              {subcategories.length !== 1 ? "ies" : "y"} matching &quot;
              <strong className="text-purple-700">{searchQuery}</strong>&quot;
            </span>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {count} subcategory(ies) selected
          </span>
          <FormButton
            type="button"
            label={`Delete Selected (${count})`}
            variant="delete"
            size="sm"
            disabled={isDeleting}
            onClick={handleBulkDelete}
          />
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        {sortedSubcategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-sm">No subcategories match your search</p>
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              </div>
            ) : (
              <p className="text-sm">No subcategories found</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      count === sortedSubcategories.length &&
                      sortedSubcategories.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
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
                  label="Created"
                  sortKey="createdAt"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
              </tr>
            </thead>
            <tbody>
              {paginatedSubcategories.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  onDoubleClick={(e) => {
                    // Prevent triggering if clicking on checkbox
                    if (
                      (e.target as HTMLElement).closest(
                        "input[type='checkbox']"
                      )
                    ) {
                      return;
                    }
                    // Open the edit modal with the selected subcategory
                    setSelectedSubcategory(sub);
                    setIsEditModalOpen(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      id={`select-${sub.id}`}
                      checked={selectedIds.has(sub.id)}
                      onChange={() => handleSelectOne(sub.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <SubcategoryTableRow
                    subcategory={sub}
                    categoryId={categoryId}
                    onEdit={() => {
                      setSelectedSubcategory(sub);
                      setIsEditModalOpen(true);
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {sortedSubcategories.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsStart={startIndex + 1}
          itemsEnd={Math.min(endIndex, sortedSubcategories.length)}
          totalItems={sortedSubcategories.length}
          entityName="subcategories"
        />
      )}
      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Subcategories"
        message={`Are you sure you want to delete ${count} subcategory(ies)? This action cannot be undone.`}
        confirmLabel="Delete All"
        isLoading={isDeleting}
      />

      {selectedSubcategory && (
        <EditSubcategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSubcategory(null);
          }}
          subcategory={selectedSubcategory}
          categoryId={categoryId}
          formAction={formAction}
        />
      )}
    </div>
  );
}
