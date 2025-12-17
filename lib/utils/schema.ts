/**
 * Generic schema parsing utilities
 * Reduces duplication between FormData and JSON parsing
 */

import { z } from "zod";

/**
 * Parse data from either FormData or JSON object
 * Handles both form submissions and API calls
 */
export function parseSchemaData<T>(
  schema: z.ZodSchema<T>,
  data: FormData | Record<string, unknown>
): T {
  // Convert FormData to object if needed
  const dataObj: Record<string, unknown> =
    data instanceof FormData ? Object.fromEntries(data) : data;

  const parsed = schema.safeParse(dataObj);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Validation failed";
    throw new Error(firstError);
  }

  return parsed.data;
}

/**
 * Extract error message from schema validation
 */
export function getSchemaError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An error occurred";
}
