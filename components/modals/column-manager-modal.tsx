"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Eye, EyeOff, Search } from "lucide-react";
import { ColumnVisibility } from "@/lib/hooks/useColumnVisibility";

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnVisibility[];
  onToggleColumn: (columnId: string) => void;
  onToggleAllColumns: () => void;
  hiddenCount: number;
}

/**
 * Column Manager Modal
 * Allows users to show/hide table columns with search functionality
 *
 * Features:
 * - Search/filter columns by name (case-insensitive)
 * - Toggle individual columns
 * - Show All / Hide All toggle (shows only essentials when all hidden)
 * - Backdrop click to close
 * - Escape key to close
 * - Prevents background scroll/interaction when open
 * - Mobile-responsive (search input scales on all devices)
 * - Production-ready design with SaaS polish
 * - Accessibility support (ARIA labels, semantic HTML)
 * - Scales gracefully to any number of columns (10+)
 */
export default function ColumnManagerModal({
  isOpen,
  onClose,
  columns,
  onToggleColumn,
  onToggleAllColumns,
  hiddenCount,
}: ColumnManagerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter columns based on search query
  const filteredColumns = useCallback(() => {
    if (!searchQuery.trim()) return columns;
    const lowerQuery = searchQuery.toLowerCase();
    return columns.filter((col) =>
      col.label.toLowerCase().includes(lowerQuery)
    );
  }, [columns, searchQuery]);

  const displayColumns = filteredColumns();
  const hasSearchResults = displayColumns.length > 0;

  if (!isOpen) return null;

  // Determine if we should show "Show All" or "Hide All"
  const showShowAllButton = hiddenCount > 0;

  return (
    <>
      {/* Backdrop - Click to close, prevents interaction with page */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - pointer-events-none so clicks pass through to children */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
        {/* Modal Box - pointer-events-auto to be interactive */}
        <div
          className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 animate-in fade-in zoom-in-95 duration-300 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="column-modal-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
            <div>
              <h2
                id="column-modal-title"
                className="text-base sm:text-lg font-semibold text-gray-900"
              >
                Columns
              </h2>
              {hiddenCount > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {hiddenCount} hidden
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search columns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  aria-label="Search columns"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action - Show All / Hide All Toggle */}
            <div className="pb-4 border-b border-gray-100">
              <button
                onClick={onToggleAllColumns}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                  searchQuery ? "opacity-50 pointer-events-none" : ""
                } ${
                  showShowAllButton
                    ? "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    : "text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                }`}
                title={
                  searchQuery
                    ? "Clear search to use this button"
                    : showShowAllButton
                    ? "Show all columns"
                    : "Hide optional columns"
                }
                disabled={!!searchQuery}
                type="button"
              >
                {showShowAllButton ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show All</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide All</span>
                  </>
                )}
              </button>
            </div>

            {/* Column List */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
              {hasSearchResults ? (
                displayColumns.map((column) => (
                  <label
                    key={column.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      column.essential
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-purple-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() =>
                        !column.essential && onToggleColumn(column.id)
                      }
                      disabled={column.essential}
                      className="w-4 h-4 rounded-md border-gray-300 text-purple-600 checked:bg-purple-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 accent-purple-600"
                      aria-label={`Toggle ${column.label} column visibility`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {column.label}
                      </div>
                      {column.essential && (
                        <span className="text-xs text-gray-400 font-medium">
                          Always shown
                        </span>
                      )}
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    No columns match &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>

            {!searchQuery && columns.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No columns available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
