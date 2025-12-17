/**
 * TypeScript type definitions for filter and inventory system
 * Centralizes type definitions for better type safety
 */

import { SORT_OPTIONS, STOCK_STATUS_OPTIONS } from "@/lib/constants/filters";

// Extract types from constants using 'as const'
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
export type StockStatusValue = (typeof STOCK_STATUS_OPTIONS)[number]["value"];

// Filter parameters interface
export interface FilterParams {
  categories?: string[];
  subcategories?: string[];
  status?: StockStatusValue;
  sort?: SortValue;
  search?: string;
  page?: number;
}

// Active filter display interface
export interface ActiveFilter {
  type: "category" | "subcategory" | "status" | "sort";
  label: string;
  emoji?: string;
}

// Inventory filter component props
export interface InventoryFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
  currentCategories?: string[];
  currentSubcategories?: string[];
  currentStatus?: string;
  currentSort?: string;
}

// Sort option interface
export interface SortOption {
  value: SortValue;
  label: string;
}

// Stock status option interface
export interface StockStatusOption {
  value: StockStatusValue;
  label: string;
  emoji: string;
}

// Pagination interface
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

// Serialized product for client-side display
export interface SerializedProduct {
  id: string;
  name: string;
  price: number | null;
  quantity: number;
  sku: string | null;
  image: string | null;
  lowStockAt: number | null;
  createdAt: string;
  categories: Array<{ id: string; name: string }>;
  subcategories: Array<{ id: string; name: string; category: { id: string; name: string } }>;
}
