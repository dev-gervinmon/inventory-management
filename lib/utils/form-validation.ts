import { z, ZodSchema } from "zod";

export interface FieldError {
  [key: string]: string;
}

/**
 * Validate data and return field-level errors instead of just first error
 */
export function validateFormData<T>(
  schema: ZodSchema<T>,
  data: FormData | Record<string, unknown>
): { success: boolean; data?: T; errors: FieldError } {
  // Convert FormData to object if needed
  const dataObj: Record<string, unknown> =
    data instanceof FormData ? Object.fromEntries(data) : data;

  const parsed = schema.safeParse(dataObj);

  if (!parsed.success) {
    const errors: FieldError = {};
    parsed.error.issues.forEach((issue) => {
      const fieldName = issue.path.join(".");
      errors[fieldName] = issue.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: parsed.data, errors: {} };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: FieldError, fieldName: string): string {
  return errors[fieldName] || "";
}

/**
 * Check if field has error
 */
export function hasFieldError(errors: FieldError, fieldName: string): boolean {
  return !!errors[fieldName];
}
