import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type Category = z.infer<typeof CategorySchema>;

export function parseCategoryData(formData: FormData) {
  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Validation failed";
    throw new Error(first);
  }

  return parsed.data;
}

export function parseCategoryDataJSON(data: { name?: string }) {
  const parsed = CategorySchema.safeParse({
    name: data.name,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Validation failed";
    throw new Error(first);
  }

  return parsed.data;
}
