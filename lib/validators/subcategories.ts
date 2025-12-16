import { jsonError, notFound } from "../errors/http";
import prisma from "../prisma";

export function actionRequireId(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) {
    throw new Error("Subcategory ID is required");
  }
  return id;
}

export function apiValidateSubcategoryInput(body: {
  name?: string;
  categoryId?: string;
}) {
  const { name, categoryId } = body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return jsonError("Name is required", 400);
  }

  if (typeof categoryId !== "string" || !categoryId.trim()) {
    return jsonError("Category ID is required", 400);
  }
  return { name: name.trim(), categoryId: categoryId.trim() };
}

export async function apiExistingCategoryCheck(categoryId: string) {
  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!categoryExists) {
    return notFound("Category not found");
  }
}

export function apiRequireId(params: { id?: string }) {
  const id = String(params.id ?? "").trim();
  if (!id) {
    throw new Error("Subcategory ID is required");
  }
  return id;
}

export async function apiRequireSubcategoryExists(id: string) {
  const exists = await prisma.subcategory.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    return notFound("Subcategory not found");
  }
}
