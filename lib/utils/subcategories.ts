/**
 * Subcategory validation and utility constants/functions
 */

/**
 * Action response type for form submissions
 */
export type ActionResponse = {
  success: boolean;
  error?: string;
};

export const SUBCATEGORY_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 50,
};

export const UI_CONSTANTS = {
  MESSAGE_TIMEOUT: 3000, // ms
};

/**
 * Validate subcategory name
 * @param value - The name to validate
 * @returns Error message or empty string if valid
 */
export function validateSubcategoryName(value: string): string {
  if (!value.trim()) {
    return "Subcategory name is required";
  }
  if (value.length > SUBCATEGORY_LIMITS.NAME_MAX) {
    return `Subcategory name must be ${SUBCATEGORY_LIMITS.NAME_MAX} characters or less`;
  }
  return "";
}

/**
 * Format error message from server response
 * @param error - The error or response object
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Get input styling based on error state
 * @param hasError - Whether there's an error
 * @returns CSS class string
 */
export function getInputClassName(hasError: boolean): string {
  const baseClass = "flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition";
  const errorClass = "border-red-300 focus:ring-red-500";
  const normalClass = "border-gray-300 focus:ring-purple-500";
  
  return `${baseClass} ${hasError ? errorClass : normalClass}`;
}
