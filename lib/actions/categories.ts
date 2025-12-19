"use server";

import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";

type ActionResponse = {
  success: boolean;
  error?: string;
};

/**
 * Create a new category
 */
export async function createCategory(
  formData: FormData
): Promise<ActionResponse> {
  await getCurrentUser();
  const data = parseCategoryData(formData);

  try {
    const createdCategory = await prisma.category.create({
      data,
    });

    // Note: Activity logging for categories could be added here if needed
    // await logActivity(userId, { ... })
    return {
      success: true,
    };
  } catch (error) {
    const message = handlePrismaActionError(error, "Category");
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Update an existing category
 */
export async function editCategory(
  formData: FormData
): Promise<ActionResponse> {
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

    return {
      success: true,
    };
  } catch (error) {
    const message = handlePrismaActionError(error, "Category");
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Delete a category and all its subcategories
 */
export async function deleteCategory(
  formData: FormData
): Promise<ActionResponse> {
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
    return {
      success: true,
    };
  } catch (error) {
    const message = handlePrismaActionError(error, "Category");
    return {
      success: false,
      error: message,
    };
  }
}
