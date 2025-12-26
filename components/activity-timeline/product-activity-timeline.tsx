"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ActivityTable from "@/components/tables/activity-table";
import type { Activity } from "@/lib/types/activities";

interface ProductActivityTimelineProps {
  activities: Activity[];
  productId: string;
}

/**
 * Product Activity Timeline
 * Displays a collapsible history of all changes made to a product
 * Integrated directly in the product edit page for quick access to change history
 */
export default function ProductActivityTimeline({
  activities,
  productId,
}: ProductActivityTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter activities for this product
  const productActivities = activities.filter(
    (activity) => activity.entityId === productId
  );

  if (productActivities.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-10 md:mt-12">
      {/* Timeline Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl md:text-2xl">📋</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              Product History
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {productActivities.length}{" "}
              {productActivities.length === 1 ? "change" : "changes"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Timeline Content */}
      {isExpanded && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <ActivityTable
            activities={productActivities}
            showPagination={productActivities.length > 15}
            showFilters={false}
            showSearch={false}
            maxHeight="max-h-96 sm:max-h-[500px]"
          />
        </div>
      )}
    </div>
  );
}
