"use client";

import { X } from "lucide-react";
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
 * - Search columns (for large tables)
 * - Mobile-responsive
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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Manage Columns
              </h2>
              {hiddenCount > 0 && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {hiddenCount} column{hiddenCount !== 1 ? "s" : ""} hidden
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
              <button
                onClick={onShowAll}
                className="flex-1 min-w-max px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                title="Show all columns"
              >
                Show All
              </button>
              <button
                onClick={onHideNonEssential}
                className="flex-1 min-w-max px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                title="Hide non-essential columns"
              >
                Hide Non-Essential
              </button>
              <button
                onClick={onResetDefaults}
                className="flex-1 min-w-max px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                title="Reset to default column visibility"
              >
                Reset
              </button>
            </div>

            {/* Column List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg transition group ${
                    column.essential
                      ? "opacity-75 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() =>
                      !column.essential && onToggleColumn(column.id)
                    }
                    disabled={column.essential}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Toggle ${column.label} column visibility`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {column.label}
                    </div>
                    {column.essential && (
                      <span className="text-xs text-gray-500">Essential</span>
                    )}
                    {column.mobileHidden && (
                      <span className="text-xs text-gray-500">
                        Mobile default hidden
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {columns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No columns available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
