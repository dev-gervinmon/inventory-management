/**
 * Form and product operation constants
 * Centralized definitions for timeouts, delays, and common paths
 */

// Modal and UI timing constants (in milliseconds)
export const UI_TIMING = {
  /** Delay before success modal auto-closes after product creation */
  SUCCESS_MODAL_DELAY_MS: 3500,
  /** Delay before success modal auto-closes after category/subcategory deletion */
  DELETE_SUCCESS_MODAL_DELAY_MS: 4000,
  /** Delay before redirecting after product deletion */
  DELETE_REDIRECT_DELAY_MS: 1500,
  /** Timeout for message notifications */
  MESSAGE_TIMEOUT_MS: 3000,
  /** Timeout for error messages */
  ERROR_MESSAGE_TIMEOUT_MS: 5000,
  /** Debounce delay for form inputs */
  FORM_INPUT_DEBOUNCE_MS: 300,
} as const;

// Navigation paths
export const FORM_PATHS = {
  /** Base path for inventory products */
  INVENTORY_BASE: "/inventory",
  /** Path to edit a specific product (append product ID) */
  EDIT_PRODUCT_SUFFIX: "/edit-product",
} as const;

// Form validation limits
export const FORM_LIMITS = {
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 100,
  PRODUCT_SKU_MAX: 50,
  CATEGORY_NAME_MIN: 1,
  CATEGORY_NAME_MAX: 50,
  SUBCATEGORY_NAME_MIN: 1,
  SUBCATEGORY_NAME_MAX: 50,
} as const;

/**
 * Get the full edit product path for a given product ID
 * @param productId - The ID of the product to edit
 * @returns The full edit product path
 */
export function getEditProductPath(productId: string): string {
  return `${FORM_PATHS.INVENTORY_BASE}/${productId}${FORM_PATHS.EDIT_PRODUCT_SUFFIX}`;
}
