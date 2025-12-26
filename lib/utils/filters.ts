/**
 * Utility functions for handling filter URL parameters
 * Centralizes URL parameter building and parsing logic
 */

import {
  SORT_OPTIONS,
  STOCK_STATUS_OPTIONS,
  type StockStatusType,
  type SortType,
} from "@/lib/constants/filters";

interface FilterParams {
  categories?: string[];
  subcategories?: string[];
  status?: StockStatusType;
  sort?: SortType;
  search?: string;
  page?: number;
  actionType?: string; // For activity page
  entityType?: string; // For activity page
}

/**
 * Build URL search params from filter object
 * Handles array parameters (categories, subcategories) correctly
 */
export function buildFilterUrl(params: FilterParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("q", params.search);
  }

  if (params.categories?.length) {
    params.categories.forEach((id) => {
      searchParams.append("categories", id);
    });
  }

  if (params.subcategories?.length) {
    params.subcategories.forEach((id) => {
      searchParams.append("subcategory", id);
    });
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.actionType) {
    searchParams.set("actionType", params.actionType);
  }

  if (params.entityType) {
    searchParams.set("entityType", params.entityType);
  }

  return searchParams;
}

/**
 * Parse URL params into consistent array format
 * Converts single string values to arrays for consistent handling
 */
export function parseArrayParam(
  param: string | string[] | undefined
): string[] {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
}

/**
 * Get sort option label by value
 */
export function getSortLabel(sortValue?: string): string {
  if (!sortValue) return "Sort by";
  const option = SORT_OPTIONS.find((opt) => opt.value === sortValue);
  return option?.label ?? "Sort by";
}

/**
 * Get stock status label and emoji by value
 */
export function getStatusInfo(statusValue?: string): {
  label: string;
  emoji: string;
} {
  if (!statusValue) return { label: "All Items", emoji: "📦" };
  const option = STOCK_STATUS_OPTIONS.find((opt) => opt.value === statusValue);
  return option
    ? { label: option.label, emoji: option.emoji }
    : { label: "Filter", emoji: "🔍" };
}

/**
 * Check if a sort value is valid
 */
export function isValidSort(sort: unknown): sort is SortType {
  return (
    typeof sort === "string" && SORT_OPTIONS.some((opt) => opt.value === sort)
  );
}

/**
 * Check if a status value is valid
 */
export function isValidStatus(status: unknown): status is StockStatusType {
  return (
    typeof status === "string" &&
    STOCK_STATUS_OPTIONS.some((opt) => opt.value === status)
  );
}

/**
 * Format active filters for display
 * Returns array of filter chips with their values
 */
export function formatActiveFilters(
  params: FilterParams
): Array<{ type: string; label: string; emoji?: string }> {
  const filters: Array<{ type: string; label: string; emoji?: string }> = [];

  if (params.categories?.length) {
    filters.push({
      type: "category",
      label: `${params.categories.length} category${
        params.categories.length !== 1 ? "ies" : ""
      }`,
      emoji: "📁",
    });
  }

  if (params.subcategories?.length) {
    filters.push({
      type: "subcategory",
      label: `${params.subcategories.length} subcategory${
        params.subcategories.length !== 1 ? "ies" : ""
      }`,
      emoji: "🏷️",
    });
  }

  if (params.status && params.status !== "all") {
    const statusInfo = getStatusInfo(params.status);
    filters.push({
      type: "status",
      label: statusInfo.label,
      emoji: statusInfo.emoji,
    });
  }

  if (params.sort && params.sort !== "newest") {
    const sortLabel = getSortLabel(params.sort);
    filters.push({
      type: "sort",
      label: sortLabel,
      emoji: "↕️",
    });
  }

  return filters;
}

/**
 * Clear specific filter type from URL
 * Returns new URLSearchParams without the specified filter
 */
export function clearFilter(
  currentParams: URLSearchParams,
  filterType: "category" | "subcategory" | "status" | "sort"
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams);

  switch (filterType) {
    case "category":
      newParams.delete("category");
      break;
    case "subcategory":
      newParams.delete("subcategory");
      break;
    case "status":
      newParams.delete("status");
      break;
    case "sort":
      newParams.delete("sort");
      break;
  }

  // Reset to page 1 when filters change
  newParams.set("page", "1");
  return newParams;
}

/**
 * Clear all filters and return to default state
 */
export function clearAllFilters(
  currentParams: URLSearchParams
): URLSearchParams {
  const newParams = new URLSearchParams();
  const search = currentParams.get("q");
  if (search) {
    newParams.set("q", search);
  }
  newParams.set("page", "1");
  return newParams;
}
