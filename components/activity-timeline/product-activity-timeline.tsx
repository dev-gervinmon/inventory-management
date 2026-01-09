"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ActivityTable from "@/components/tables/activity-table";
import type { Activity } from "@/lib/types/activities";

interface ProductActivityTimelineProps {
  activities: Activity[];
  productId: string;
  defaultExpanded?: boolean;
}

/**
 * Product Activity Timeline
 * Displays a collapsible history of all changes made to a product
 * Integrated directly in the product edit page for quick access to change history
 */
export default function ProductActivityTimeline({
  activities,
  productId,
  defaultExpanded = false,
}: ProductActivityTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Filter activities for this product
  const productActivities = activities.filter(
    (activity) => activity.entityId === productId
  );

  if (productActivities.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Timeline Section Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 hover:bg-(--surface-elevated)/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg sm:text-xl" aria-hidden>
            📋
          </span>
          <div className="text-left min-w-0">
            <h3 className="font-semibold text-(--text-primary) text-sm sm:text-base truncate">
              Product History
            </h3>
            <p className="text-xs sm:text-sm text-(--text-muted)">
              {productActivities.length}{" "}
              {productActivities.length === 1 ? "change" : "changes"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-(--text-muted) transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Timeline Content */}
      {isExpanded && (
        <div className="mt-4 rounded-2xl bg-(--surface-elevated)/10 overflow-hidden">
          <ActivityTable
            activities={productActivities}
            showPagination={productActivities.length > 15}
            showSearch={false}
            maxHeight="max-h-96 sm:max-h-[500px]"
          />
        </div>
      )}
    </div>
  );
}
