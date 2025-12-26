"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useMemo } from "react";
import { INPUT_CLASS, INPUT_FOCUS_BLUE } from "@/lib/constants/filters";
import { buildFilterUrl } from "@/lib/utils/filters";
import FormButton from "@/components/buttons/form-button";
import {
  ENTITY_TYPE_OPTIONS,
  GENERAL_ACTION_OPTIONS,
  PRODUCT_ACTION_OPTIONS,
} from "@/lib/constants/activities";

interface ActivityFiltersProps {
  currentActionType?: string;
  currentEntityType?: string;
}

/**
 * Activity Filters Component
 * Provides filtering options for activities by entity type and action type
 * Features collapsible interface on mobile/tablet, always expanded on desktop
 * Action type options are conditional based on selected entity type
 */
export default function ActivityFilters({
  currentActionType,
  currentEntityType,
}: ActivityFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleEntityTypeChange = (entityType: string) => {
    const newEntityType = entityType === "all" ? undefined : entityType;

    const params = buildFilterUrl({
      actionType: currentActionType,
      entityType: newEntityType,
    });

    startTransition(() => {
      router.push(`/activities?${params.toString()}`);
    });
  };

  const handleActionTypeChange = (actionType: string) => {
    const newActionType = actionType === "all" ? undefined : actionType;

    const params = buildFilterUrl({
      actionType: newActionType,
      entityType: currentEntityType,
    });

    startTransition(() => {
      router.push(`/activities?${params.toString()}`);
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.push("/activities");
    });
  };

  // Determine which action options to show based on selected entity type
  const actionOptions = useMemo(() => {
    if (currentEntityType === "PRODUCT") {
      // Show both general and product-specific actions
      return [...GENERAL_ACTION_OPTIONS, ...PRODUCT_ACTION_OPTIONS];
    }
    // For other entity types, show only general actions
    return GENERAL_ACTION_OPTIONS;
  }, [currentEntityType]);

  const hasActiveFilters =
    (currentActionType && currentActionType !== "all") ||
    (currentEntityType && currentEntityType !== "all");

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      {/* Header - Clickable on mobile/tablet, non-interactive on desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 flex items-center justify-between lg:cursor-default lg:py-0! lg:pb-6!"
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {(currentActionType ? 1 : 0) + (currentEntityType ? 1 : 0)}
            </span>
          )}
        </div>

        {/* Toggle Icon - Visible only on mobile and tablet */}
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 lg:hidden ${
            isOpen ? "rotate-180" : ""
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

      {/* Content - Collapsible on mobile/tablet (md and below), always visible on desktop (lg and above) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:max-h-none! ${
          isOpen ? "max-h-96 sm:max-h-[500px]" : "max-h-0 lg:max-h-none"
        }`}
      >
        <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 space-y-6 border-t border-gray-200 lg:border-t-0 lg:pt-0">
          {/* Entity Type Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Entity Type
            </label>
            <select
              value={currentEntityType || "all"}
              onChange={(e) => handleEntityTypeChange(e.target.value)}
              disabled={isPending}
              className={`${INPUT_CLASS} ${INPUT_FOCUS_BLUE}`}
            >
              {ENTITY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              value={currentActionType || "all"}
              onChange={(e) => handleActionTypeChange(e.target.value)}
              disabled={isPending}
              className={`${INPUT_CLASS} ${INPUT_FOCUS_BLUE}`}
            >
              <option value="all">All Actions</option>
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <FormButton
              type="button"
              label="Clear All Filters"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={handleClearAll}
              className="w-full"
            />
          )}

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentEntityType && currentEntityType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {
                      ENTITY_TYPE_OPTIONS.find(
                        (opt) => opt.value === currentEntityType
                      )?.emoji
                    }{" "}
                    {
                      ENTITY_TYPE_OPTIONS.find(
                        (opt) => opt.value === currentEntityType
                      )?.label
                    }
                    <button
                      onClick={() => handleEntityTypeChange("all")}
                      className="ml-1 hover:text-blue-900"
                      aria-label="Remove entity type filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {currentActionType && currentActionType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {
                      actionOptions.find(
                        (opt) => opt.value === currentActionType
                      )?.emoji
                    }{" "}
                    {
                      actionOptions.find(
                        (opt) => opt.value === currentActionType
                      )?.label
                    }
                    <button
                      onClick={() => handleActionTypeChange("all")}
                      className="ml-1 hover:text-green-900"
                      aria-label="Remove action type filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
