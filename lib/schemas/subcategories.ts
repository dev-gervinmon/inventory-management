import { z } from "zod";
import { SUBCATEGORY_LIMITS } from "../utils/categories";
import { parseSchemaData } from "../utils/schema";

export const SubcategorySchema = z.object({
  name: z
    .string()
    .min(SUBCATEGORY_LIMITS.NAME_MIN, "Subcategory name is required")
    .max(SUBCATEGORY_LIMITS.NAME_MAX, "Subcategory name is too long"),
  categoryId: z.string().min(1, "Category ID is required"),
});

export type Subcategory = z.infer<typeof SubcategorySchema>;

/**
 * Parse subcategory data from FormData or object
 */
export function parseSubcategoryData(
  data: FormData | Record<string, string>
): Subcategory {
  return parseSchemaData(SubcategorySchema, data);
}
