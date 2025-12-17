/**
 * Filter and sort constants for inventory management
 * Centralized definitions to avoid duplication across components
 */

// Stock status filter options
export const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Items", emoji: "📦" },
  { value: "in-stock", label: "In Stock", emoji: "✅" },
  { value: "low-stock", label: "Low Stock", emoji: "⚠️" },
  { value: "out-of-stock", label: "Out of Stock", emoji: "❌" },
] as const;

export type StockStatusType = (typeof STOCK_STATUS_OPTIONS)[number]["value"];

// Sort options for inventory
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "stock-low", label: "Low Stock First" },
  { value: "quantity-high", label: "Quantity: High to Low" },
] as const;

export type SortType = (typeof SORT_OPTIONS)[number]["value"];

// Pagination constants
export const PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Search input debounce delay (in ms)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Filter list max heights and sizing
export const FILTER_LIST_MAX_HEIGHT = 256; // px
export const FILTER_LIST_MAX_HEIGHT_CLASS = "max-h-64"; // Tailwind class

// Input styling constants
export const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400";
export const INPUT_FOCUS_PURPLE = "focus:ring-purple-500";
export const INPUT_FOCUS_BLUE = "focus:ring-blue-500";

// Badge styling presets
export const BADGE_COLORS = {
  category: "bg-purple-100 text-purple-700",
  subcategory: "bg-blue-100 text-blue-700",
  status: "bg-orange-100 text-orange-700",
  sort: "bg-gray-100 text-gray-700",
} as const;
