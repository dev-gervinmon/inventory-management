import { z } from "zod";

export const SubcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
});

export type Subcategory = z.infer<typeof SubcategorySchema>;

export function parseSubcategoryData(formData: FormData) {
  const parsed = SubcategorySchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Validation failed";
    throw new Error(first);
  }

  return parsed.data;
}

export function parseSubcategoryDataJSON(data: {
  name?: string;
  categoryId?: string;
}) {
  const parsed = SubcategorySchema.safeParse({
    name: data.name,
    categoryId: data.categoryId,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Validation failed";
    throw new Error(first);
  }
  return parsed.data;
}
