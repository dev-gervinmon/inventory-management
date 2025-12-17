/**
 * Category and Subcategory utilities
 */

export const CATEGORY_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 100,
} as const;

export const SUBCATEGORY_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 100,
} as const;

/**
 * Format category/subcategory date for display
 */
export function formatCategoryDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Confirm delete action with user
 */
export function confirmDelete(
  itemName: string,
  itemType: "category" | "subcategory"
): boolean {
  return confirm(
    `Are you sure you want to delete this ${itemType}?\n\n"${itemName}" will be permanently removed.`
  );
}

/**
 * Get empty state messages
 */
export function getEmptyStateMessage(
  type: "categories" | "subcategories"
): string {
  const messages = {
    categories: "No categories yet",
    subcategories: "No subcategories yet",
  };
  return messages[type];
}

/**
 * Get category count text
 */
export function getCategorySubcategoryLabel(count: number): string {
  if (count === 0) return "No subcategories";
  if (count === 1) return "1 subcategory";
  return `${count} subcategories`;
}
