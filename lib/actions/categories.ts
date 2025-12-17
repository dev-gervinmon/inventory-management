"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import prisma from "../prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";
import { logActivity } from "./activities";

/**
 * Create a new category
 */
export async function createCategory(formData: FormData) {
  await getCurrentUser();
  const data = parseCategoryData(formData);

  try {
    const createdCategory = await prisma.category.create({
      data,
    });

    // Note: Activity logging for categories could be added here if needed
    // await logActivity(userId, { ... })
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}

/**
 * Update an existing category
 */
export async function editCategory(formData: FormData) {
  await getCurrentUser();
  const id = actionRequireId(formData);
  const data = parseCategoryData(formData);

  try {
    const oldCategory = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.category.update({
      where: { id },
      data,
    });

    // Log if name changed
    if (oldCategory?.name !== data.name) {
      // Activity logging could be added here if category changes are important to track
    }
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}

/**
 * Delete a category and all its subcategories
 */
export async function deleteCategory(formData: FormData) {
  await getCurrentUser();
  const id = actionRequireId(formData);

  try {
    const categoryData = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.category.delete({
      where: { id },
    });

    // Note: Category deletion cascades to subcategories via database
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}
