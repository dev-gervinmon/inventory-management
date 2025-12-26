"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import CloseButton from "@/components/buttons/close-button";
import FormButton from "@/components/buttons/form-button";
import type { Activity } from "@/lib/types/activities";
import { ACTION_TYPE_MAP } from "@/lib/constants/activities";
import { revertActivity } from "@/lib/actions/products";

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component that displays detailed information about a single activity
 * Includes entity name, action type, timestamp, message, and any stored details
 * Allows reverting product edits to previous versions
 */
export default function ActivityDetailModal({
  activity,
  isOpen,
  onClose,
}: ActivityDetailModalProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [revertState, setRevertState] = useState<"idle" | "reverting">("idle");

  // Format exact timestamp
  const exactTime = useMemo(() => {
    if (!activity) return "";
    return new Date(activity.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, [activity]);

  // Check if activity can be reverted (only EDITED/STOCK/PRICE updates with old values)
  const canRevert = useMemo(() => {
    if (!activity) return false;

    // Don't allow reverting ADDED activities or already-reverted activities
    if (activity.actionType === "ADDED" || activity.actionType === "DELETED") {
      return false;
    }

    // Don't allow reverting reverts (prevent circular reverts)
    if (
      activity.actionType === "EDITED" &&
      activity.message &&
      activity.message.includes("reverted")
    ) {
      return false;
    }

    // Only allow reverting STOCK/PRICE/EDITED activities
    if (
      activity.actionType !== "STOCK_UPDATED" &&
      activity.actionType !== "PRICE_UPDATED" &&
      activity.actionType !== "EDITED"
    ) {
      return false;
    }

    // Check if activity has revertible details with old values
    if (!activity.details || Object.keys(activity.details).length === 0) {
      return false;
    }

    const details = activity.details as Record<string, unknown>;
    const hasOldValues =
      details.quantity_old !== undefined ||
      details.price_old !== undefined ||
      details.name_old !== undefined;

    return hasOldValues;
  }, [activity]);

  // Handle revert action
  const handleRevert = async () => {
    if (!activity?.entityId || !activity?.id) return;

    setRevertState("reverting");

    try {
      await revertActivity(activity.entityId, activity.id);
      // Wait a moment for user to see the "Reverting..." state, then reload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.reload();
    } catch (error) {
      setRevertState("idle");
      alert(
        `Failed to revert: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (!isOpen || !activity) return null;

  const typeInfo = ACTION_TYPE_MAP[activity.actionType] || {
    label: activity.actionType,
    emoji: "📋",
    color: "bg-gray-100 text-gray-700",
  };

  // Build navigation link based on entity type
  const getEntityLink = () => {
    if (!activity.entityId) return null;

    switch (activity.entityType) {
      case "PRODUCT":
        return `/inventory/${activity.entityId}/edit-product`;
      case "CATEGORY":
        return `/categories/${activity.entityId}`;
      case "SUBCATEGORY":
        return `/categories/subcategory/${activity.entityId}`;
      default:
        return null;
    }
  };

  const entityLink = getEntityLink();

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/30 z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Show Reverting State */}
          {revertState === "reverting" && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  Reverting...
                </p>
                <p className="text-sm text-gray-600">
                  Restoring &quot;{activity?.entityName}&quot; to previous
                  version
                </p>
              </div>
            </div>
          )}

          {/* Show Normal Detail View */}
          {revertState === "idle" && (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 sm:flex sm:items-center sm:justify-between rounded-t-xl">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Activity Details
                  </h2>
                </div>
                <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
                  <CloseButton onClick={onClose} variant="gray" size="md" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Action Badge */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Action
                  </h3>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${typeInfo.color}`}
                  >
                    <span className="text-lg">{typeInfo.emoji}</span>
                    <span>{typeInfo.label}</span>
                  </span>
                </div>

                {/* Entity Information */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    {activity.entityType === "PRODUCT" && "Product"}
                    {activity.entityType === "CATEGORY" && "Category"}
                    {activity.entityType === "SUBCATEGORY" && "Subcategory"}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm sm:text-base font-medium text-gray-900 flex-wrap">
                      {activity.entityName}
                    </p>
                    {entityLink && activity.entityId && (
                      <a
                        href={entityLink}
                        className="ml-3 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs md:text-sm font-semibold rounded-lg transition-colors"
                      >
                        View
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7m0 0l-7 7m7-7H5"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Timestamp
                  </h3>
                  <p className="text-sm text-gray-700">{exactTime}</p>
                </div>

                {/* User */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    User
                  </h3>
                  <p className="text-sm text-gray-700">
                    {activity.userName || "Unknown"}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {activity.message}
                  </p>
                </div>

                {/* Details (if any) */}
                {activity.details &&
                  Object.keys(activity.details).length > 0 && (
                    <div>
                      <button
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="w-full flex items-center justify-between mb-3 hover:opacity-75 transition"
                      >
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Change Details
                        </h3>
                        <svg
                          className={`w-4 h-4 text-gray-600 transition-transform ${
                            isDetailsExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                      {isDetailsExpanded && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200 animate-in fade-in duration-200">
                          {Object.entries(activity.details).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 last:pb-0 border-b border-gray-200 last:border-b-0"
                              >
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </span>
                                <span className="text-sm text-gray-900 font-medium text-right flex-wrap">
                                  {typeof value === "object"
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* ID Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Activity ID
                  </h3>
                  <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 px-3 py-2 rounded">
                    {activity.id}
                  </p>
                </div>

                {/* Restore Button */}
                {canRevert && activity.entityType === "PRODUCT" && (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <FormButton
                      type="button"
                      label="Restore This Version"
                      variant="primary"
                      size="md"
                      disabled={false}
                      isLoading={false}
                      onClick={handleRevert}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600 text-center">
                      This will revert &quot;{activity.entityName}&quot; to this
                      previous state
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
