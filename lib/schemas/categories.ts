import { z } from "zod";
import { CATEGORY_LIMITS } from "../utils/categories";
import { parseSchemaData } from "../utils/schema";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(CATEGORY_LIMITS.NAME_MIN, "Category name is required")
    .max(CATEGORY_LIMITS.NAME_MAX, "Category name is too long"),
});

export type Category = z.infer<typeof CategorySchema>;

/**
 * Parse category data from FormData or object
 */
export function parseCategoryData(
  data: FormData | Record<string, string>
): Category {
  return parseSchemaData(CategorySchema, data);
}
