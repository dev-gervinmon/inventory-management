"use server";

import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";
import { logActivity } from "./activities";

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
  const user = await getCurrentUser();
  const data = parseCategoryData(formData);

  try {
    const createdCategory = await prisma.category.create({
      data,
    });

    // Log the activity
    await logActivity(user.id, {
      type: "CATEGORY_ADDED",
      categoryId: createdCategory.id,
      categoryName: createdCategory.name,
      message: `Category "${createdCategory.name}" was created`,
    });

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
  const user = await getCurrentUser();
  const id = actionRequireId(formData);
  const data = parseCategoryData(formData);

  try {
    const oldCategory = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    // Log if name changed
    if (oldCategory?.name !== data.name) {
      await logActivity(user.id, {
        type: "CATEGORY_EDITED",
        categoryId: id,
        categoryName: updatedCategory.name,
        message: `Category name changed from "${oldCategory?.name}" to "${updatedCategory.name}"`,
        details: {
          oldName: oldCategory?.name || "",
          newName: updatedCategory.name,
        },
      });
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
  const user = await getCurrentUser();
  const id = actionRequireId(formData);

  try {
    const categoryData = await prisma.category.findUnique({
      where: { id },
      select: { name: true, subcategories: { select: { id: true } } },
    });

    await prisma.category.delete({
      where: { id },
    });

    // Log the deletion
    await logActivity(user.id, {
      type: "CATEGORY_DELETED",
      categoryId: id,
      categoryName: categoryData?.name || "",
      message: `Category "${categoryData?.name}" was deleted along with ${
        categoryData?.subcategories.length || 0
      } subcategory(ies)`,
      details: {
        subcategoriesDeleted: categoryData?.subcategories.length || 0,
      },
    });

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
