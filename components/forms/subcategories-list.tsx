"use client";

import { useState } from "react";
import SubcategoryTableRow from "./subcategory-table-row";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import MessageBanner from "@/components/common/message-banner";
import { deleteBulkSubcategories } from "@/lib/actions/subcategories";
import { useMessage } from "@/lib/hooks/useMessage";
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
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_CONSTANTS.MESSAGE_TIMEOUT,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter subcategories based on search query
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubcategories = filteredSubcategories.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredSubcategories.map((sub) => sub.id)));
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
      selectedIds.forEach((id) => formData.append("ids", id));
      formData.append("categoryId", categoryId);

      const response = await deleteBulkSubcategories(formData);

      if (response.success) {
        showSuccess(
          `Successfully deleted ${response.deletedCount} subcategory(ies)!`
        );
        setSelectedIds(new Set());
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
        <input
          type="text"
          placeholder="Search subcategories..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          Found {filteredSubcategories.length} of {subcategories.length}{" "}
          subcategories
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
        {filteredSubcategories.length === 0 ? (
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
                      selectedIds.size === filteredSubcategories.length &&
                      filteredSubcategories.length > 0
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
                      onChange={(e) =>
                        handleSelectOne(sub.id, e.target.checked)
                      }
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
        )}
      </div>

      {/* Pagination Controls */}
      {filteredSubcategories.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredSubcategories.length)} of{" "}
            {filteredSubcategories.length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Subcategories"
        message={`Are you sure you want to delete ${selectedIds.size} subcategory(ies)? This action cannot be undone.`}
        confirmLabel="Delete All"
        isLoading={isDeleting}
      />
    </div>
  );
}
