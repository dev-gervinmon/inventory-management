/**
 * Activity-related constants and configurations
 */

export const ENTITY_TYPE_OPTIONS = [
  { value: "all", label: "All Entities", emoji: "📋" },
  { value: "PRODUCT", label: "Products", emoji: "📦" },
  { value: "CATEGORY", label: "Categories", emoji: "📂" },
  { value: "SUBCATEGORY", label: "Subcategories", emoji: "📑" },
] as const;

export const GENERAL_ACTION_OPTIONS = [
  { value: "ADDED", label: "Added", emoji: "➕" },
  { value: "EDITED", label: "Edited", emoji: "✏️" },
  { value: "DELETED", label: "Deleted", emoji: "🗑️" },
] as const;

export const PRODUCT_ACTION_OPTIONS = [
  { value: "STOCK_UPDATED", label: "Stock Updated", emoji: "📦" },
  { value: "PRICE_UPDATED", label: "Price Updated", emoji: "💰" },
] as const;

export const ACTION_TYPE_MAP: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  ADDED: {
    label: "Added",
    emoji: "➕",
    color: "bg-green-100 text-green-700",
  },
  EDITED: {
    label: "Edited",
    emoji: "✏️",
    color: "bg-blue-100 text-blue-700",
  },
  DELETED: {
    label: "Deleted",
    emoji: "🗑️",
    color: "bg-red-100 text-red-700",
  },
  STOCK_UPDATED: {
    label: "Stock Updated",
    emoji: "📦",
    color: "bg-purple-100 text-purple-700",
  },
  PRICE_UPDATED: {
    label: "Price Updated",
    emoji: "💰",
    color: "bg-yellow-100 text-yellow-700",
  },
};

export const DEFAULT_ACTIVITY_PAGINATION = 15;
