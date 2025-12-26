"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";
import { logActivity } from "./activities";

type ActionResponse = {
  success: boolean;
  error?: string;
  data?: unknown;
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
      include: {
        subcategories: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Log the activity
    await logActivity(user.id, {
      entityType: "CATEGORY",
      actionType: "ADDED",
      entityId: createdCategory.id,
      entityName: createdCategory.name,
      message: `Category "${createdCategory.name}" was created`,
    });

    // Revalidate affected pages
    revalidatePath("/categories");

    return {
      success: true,
      data: createdCategory,
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
        entityType: "CATEGORY",
        actionType: "EDITED",
        entityId: id,
        entityName: updatedCategory.name,
        message: `Category name changed from "${
          oldCategory?.name ?? "(unknown)"
        }" to "${updatedCategory.name}"`,
        details: {
          oldName: oldCategory?.name ?? "",
          newName: updatedCategory.name,
        },
      });
    }

    // Revalidate affected pages
    revalidatePath("/categories");
    revalidatePath(`/categories/${id}`);

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
    const categoryName = categoryData?.name ?? "(unknown)";
    const subcategoryCount = categoryData?.subcategories.length ?? 0;

    await logActivity(user.id, {
      entityType: "CATEGORY",
      actionType: "DELETED",
      entityId: id,
      entityName: categoryName,
      message: `Category "${categoryName}" was deleted along with ${subcategoryCount} subcategory(ies)`,
      details: {
        subcategoriesDeleted: subcategoryCount,
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

/**
 * Delete multiple categories at once
 */
export async function deleteBulkCategories(
  formData: FormData
): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  try {
    const user = await getCurrentUser();
    const ids = formData.getAll("ids") as string[];

    if (!ids || ids.length === 0) {
      return { success: false, error: "No categories selected" };
    }

    // Get category details for logging
    const categories = await prisma.category.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, subcategories: { select: { id: true } } },
    });

    const result = await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    // Log the bulk deletion
    const categoryNames = categories.map((c) => c.name).join(", ");
    const totalSubcategories = categories.reduce(
      (sum, c) => sum + c.subcategories.length,
      0
    );

    await logActivity(user.id, {
      entityType: "CATEGORY",
      actionType: "DELETED",
      entityName: `${result.count} category(ies)`,
      message: `${result.count} category(ies) were deleted (${categoryNames}) along with ${totalSubcategories} subcategory(ies)`,
      details: {
        deletedCount: result.count,
        deletedNames: categoryNames,
        totalSubcategoriesDeleted: totalSubcategories,
      },
    });

    // Revalidate affected pages
    revalidatePath("/categories");

    return { success: true, deletedCount: result.count };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete categories";
    return { success: false, error: errorMessage };
  }
}

/**
 * Get all categories with their subcategories
 */
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch categories";
    throw new Error(errorMessage);
  }
}
