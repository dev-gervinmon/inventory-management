import { jsonError, notFound } from "../errors/http";
import prisma from "../prisma";

export function actionRequireId(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) {
    throw new Error("Category ID is required");
  }
  return id;
}

export function apiValidateCategoryInput(body: { name?: string }) {
  const { name } = body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return jsonError("Name is required", 400);
  }
  return { name: name.trim() };
}

export function apiRequireId(params: { id?: string }) {
  const id = String(params.id ?? "").trim();
  if (!id) {
    throw new Error("Category ID is required");
  }
  return id;
}

export async function apiRequireCategoryExists(id: string) {
  const exists = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    return notFound("Category not found");
  }
}
