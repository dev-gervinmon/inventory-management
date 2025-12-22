"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Eye, EyeOff, Search, Star } from "lucide-react";
import { ColumnVisibility } from "@/lib/hooks/useColumnVisibility";

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnVisibility[];
  onToggleColumn: (columnId: string) => void;
  onToggleAllColumns: () => void;
  onToggleFavorite: (columnId: string) => void;
  hiddenCount: number;
}

/**
 * Column Manager Modal
 * Allows users to show/hide table columns with search and favorites
 *
 * Features:
 * - Search/filter columns by name (case-insensitive)
 * - Star/favorite columns for quick access (favorites sort first)
 * - Track toggle frequency to understand user patterns
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
  onToggleFavorite,
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

  // Filter columns based on search query and organize into sections
  const filteredAndGroupedColumns = useCallback(() => {
    let filtered = columns;

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((col) =>
        col.label.toLowerCase().includes(lowerQuery)
      );
    }

    // Separate into three groups
    const favorites = filtered
      .filter((col) => col.isFavorited)
      .sort((a, b) => {
        // Within favorites, sort by toggle count, then alphabetically
        const countDiff = (b.toggleCount ?? 0) - (a.toggleCount ?? 0);
        if (countDiff !== 0) return countDiff;
        return a.label.localeCompare(b.label);
      });

    const essentials = filtered
      .filter((col) => !col.isFavorited && col.essential)
      .sort((a, b) => a.label.localeCompare(b.label));

    const optional = filtered
      .filter((col) => !col.isFavorited && !col.essential)
      .sort((a, b) => {
        // Within optional, sort by toggle count, then alphabetically
        const countDiff = (b.toggleCount ?? 0) - (a.toggleCount ?? 0);
        if (countDiff !== 0) return countDiff;
        return a.label.localeCompare(b.label);
      });

    return { favorites, essentials, optional, allColumns: filtered };
  }, [columns, searchQuery]);

  const { favorites, essentials, optional, allColumns } =
    filteredAndGroupedColumns();
  const hasSearchResults = allColumns.length > 0;

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

            {/* Column List - Organized by Favorites / Essential / Optional */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {hasSearchResults ? (
                <>
                  {/* Favorites Section */}
                  {favorites.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-3 py-1.5">
                        <h3 className="text-xs font-semibold text-yellow-600 uppercase tracking-wide flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          Favorites
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {favorites.map((column) => (
                          <div
                            key={column.id}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 group"
                          >
                            {!column.essential && (
                              <input
                                type="checkbox"
                                checked={column.visible}
                                onChange={() => onToggleColumn(column.id)}
                                className="w-4 h-4 rounded-md border-gray-300 text-purple-600 checked:bg-purple-600 cursor-pointer accent-purple-600 mt-0.5"
                                aria-label={`Toggle ${column.label} column visibility`}
                              />
                            )}
                            {column.essential && (
                              <div className="w-4 h-4 rounded-md border border-gray-300 bg-purple-100 flex items-center justify-center mt-0.5">
                                <div className="w-2 h-2 bg-purple-600 rounded" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">
                                {column.label}
                              </div>
                              {column.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {column.description}
                                </p>
                              )}
                              {column.essential && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Always visible
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onToggleFavorite(column.id)}
                              className="p-1.5 rounded-md transition-colors duration-150 hover:bg-yellow-100 cursor-pointer shrink-0"
                              title="Remove from favorites"
                              aria-label={`Remove ${column.label} from favorites`}
                              type="button"
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Essential Columns Group */}
                  {essentials.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-3 py-1.5">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Essential
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {essentials.map((column) => (
                          <label
                            key={column.id}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg opacity-60 cursor-not-allowed"
                          >
                            <input
                              type="checkbox"
                              checked={column.visible}
                              disabled={true}
                              className="w-4 h-4 rounded-md border-gray-300 text-purple-600 checked:bg-purple-600 cursor-not-allowed disabled:opacity-40 accent-purple-600 mt-0.5"
                              aria-label={`Toggle ${column.label} column visibility`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">
                                {column.label}
                              </div>
                              {column.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {column.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onToggleFavorite(column.id)}
                              className="p-1.5 rounded-md transition-colors duration-150 hover:bg-purple-100 cursor-pointer shrink-0"
                              title="Add to favorites"
                              aria-label={`Add ${column.label} to favorites`}
                              type="button"
                            >
                              <Star className="w-4 h-4 text-gray-400" />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Columns Group */}
                  {optional.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-3 py-1.5">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Optional
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {optional.map((column) => (
                          <div
                            key={column.id}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 group"
                          >
                            <input
                              type="checkbox"
                              checked={column.visible}
                              onChange={() => onToggleColumn(column.id)}
                              className="w-4 h-4 rounded-md border-gray-300 text-purple-600 checked:bg-purple-600 cursor-pointer accent-purple-600 mt-0.5"
                              aria-label={`Toggle ${column.label} column visibility`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">
                                {column.label}
                              </div>
                              {column.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {column.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onToggleFavorite(column.id)}
                              className="p-1.5 rounded-md transition-colors duration-150 hover:bg-purple-100 cursor-pointer shrink-0"
                              title="Add to favorites"
                              aria-label={`Add ${column.label} to favorites`}
                              type="button"
                            >
                              <Star className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
