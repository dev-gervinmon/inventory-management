import z from "zod";
import { PRODUCT_LIMITS } from "../utils/products";
import { parseSchemaData } from "../utils/schema";

const requiredNumber = (label: string) =>
  z.preprocess(
    (value) => (value === null || value === undefined ? "" : value),
    z
      .union([
        z
          .string()
          .trim()
          .min(1, `${label} is required`)
          .transform((raw) => Number(raw)),
        z.number(),
      ])
      .refine((num) => Number.isFinite(num), `${label} is required`)
  );

export const ProductSchema = z.object({
  name: z
    .string()
    .min(PRODUCT_LIMITS.NAME_MIN, "Name is required")
    .max(PRODUCT_LIMITS.NAME_MAX, "Name is too long"),
  price: requiredNumber("Price").pipe(
    z.number().min(PRODUCT_LIMITS.PRICE_MIN, "Price must be non-negative")
  ),
  unitCost: z.coerce
    .number()
    .min(0, "Unit cost must be non-negative")
    .optional(),
  quantity: requiredNumber("Quantity").pipe(
    z
      .number()
      .int("Quantity must be a whole number")
      .min(PRODUCT_LIMITS.QUANTITY_MIN, "Quantity must be non-negative")
  ),
  sku: z.string().max(PRODUCT_LIMITS.SKU_MAX, "SKU is too long").optional(),
  lowStockAt: z.coerce
    .number()
    .int()
    .min(PRODUCT_LIMITS.LOW_STOCK_MIN, "Low stock level must be non-negative")
    .optional(),
  imageUrl: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

/**
 * Parse product data from FormData or object
 */
export function parseProductData(
  data: FormData | Record<string, unknown>
): Product {
  // Handle FormData to object conversion with special field name mapping
  let dataObj: Record<string, unknown>;

  if (data instanceof FormData) {
    dataObj = Object.fromEntries(data);
    // Map 'image' field to 'imageUrl' for schema consistency
    if (dataObj.image && !dataObj.imageUrl) {
      dataObj.imageUrl = dataObj.image;
      delete dataObj.image;
    }

    // Avoid z.coerce.number() turning empty strings into 0 for optional fields.
    for (const key of ["unitCost", "lowStockAt", "sku"] as const) {
      if (dataObj[key] === "") {
        delete dataObj[key];
      }
    }
  } else {
    dataObj = {
      ...data,
      imageUrl: data.image || data.imageUrl,
    };
  }

  return parseSchemaData(ProductSchema, dataObj);
}
