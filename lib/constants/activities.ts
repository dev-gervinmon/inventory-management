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
    color:
      "bg-(--success)/15 text-(--success) ring-1 ring-(--success)/25 border border-(--border-subtle)",
  },
  EDITED: {
    label: "Edited",
    emoji: "✏️",
    color:
      "bg-(--brand)/12 text-(--brand) ring-1 ring-(--brand)/25 border border-(--border-subtle)",
  },
  DELETED: {
    label: "Deleted",
    emoji: "🗑️",
    color:
      "bg-(--danger)/15 text-(--danger) ring-1 ring-(--danger)/25 border border-(--border-subtle)",
  },
  STOCK_UPDATED: {
    label: "Stock Updated",
    emoji: "📦",
    color:
      "bg-(--surface-elevated)/30 text-(--text-secondary) ring-1 ring-(--border-strong)/50 border border-(--border-subtle)",
  },
  PRICE_UPDATED: {
    label: "Price Updated",
    emoji: "💰",
    color:
      "bg-(--warning)/15 text-(--warning) ring-1 ring-(--warning)/25 border border-(--border-subtle)",
  },
};

export const DEFAULT_ACTIVITY_PAGINATION = 15;
