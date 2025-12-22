"use client";

import { useEffect } from "react";
import { X, Eye, EyeOff, RotateCcw } from "lucide-react";
import { ColumnVisibility } from "@/lib/hooks/useColumnVisibility";

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnVisibility[];
  onToggleColumn: (columnId: string) => void;
  onShowAll: () => void;
  onHideNonEssential: () => void;
  onResetDefaults: () => void;
  hiddenCount: number;
}

/**
 * Column Manager Modal
 * Allows users to show/hide table columns
 *
 * Features:
 * - Toggle individual columns
 * - Quick actions (Show All, Hide Non-Essential, Reset)
 * - Backdrop click to close
 * - Prevents background scroll/interaction when open
 * - Mobile-responsive
 * - Production-ready design with SaaS polish
 * - Accessibility support
 */
export default function ColumnManagerModal({
  isOpen,
  onClose,
  columns,
  onToggleColumn,
  onShowAll,
  onHideNonEssential,
  onResetDefaults,
  hiddenCount,
}: ColumnManagerModalProps) {
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

  if (!isOpen) return null;

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
          <div className="p-5 sm:p-6">
            {/* Quick Actions - Horizontal Pills */}
            <div className="flex gap-2 mb-5 pb-5 border-b border-gray-100">
              <button
                onClick={onShowAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
                title="Show all columns"
                type="button"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Show All</span>
                <span className="sm:hidden">All</span>
              </button>
              <button
                onClick={onHideNonEssential}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
                title="Show only essential columns"
                type="button"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Essential</span>
                <span className="sm:hidden">Ess.</span>
              </button>
              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
                title="Reset to default layout"
                type="button"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Column List */}
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
              {columns.map((column) => (
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
              ))}
            </div>

            {columns.length === 0 && (
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
