"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";
import { logActivity } from "./activities";
import { checkActionRateLimit } from "./rate-limit";
import { ActionResponse } from "../constants/common";

/**
 * Create a new category
 */
export async function createCategory(
  formData: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:categories:create:",
    limit: 20,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const data = parseCategoryData(formData);

  try {
    const createdCategory = await prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
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
      await logActivity(tx, user.id, {
        entityType: "CATEGORY",
        actionType: "ADDED",
        entityId: category.id,
        entityName: category.name,
        message: `Category "${category.name}" was created`,
      });

      return category;
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

  const rl = await checkActionRateLimit({
    prefix: "action:categories:edit:",
    limit: 60,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const id = actionRequireId(formData);
  const data = parseCategoryData(formData);

  try {
    const oldCategory = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({
        where: { id },
        data,
      });

      // Log if name changed
      if (oldCategory?.name !== data.name) {
        await logActivity(tx, user.id, {
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
    });

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

  const rl = await checkActionRateLimit({
    prefix: "action:categories:delete:",
    limit: 30,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const id = actionRequireId(formData);

  try {
    const categoryData = await prisma.category.findUnique({
      where: { id },
      select: { name: true, subcategories: { select: { id: true } } },
    });

    await prisma.$transaction(async (tx) => {
      await tx.category.delete({
        where: { id },
      });

      // Log the deletion
      const categoryName = categoryData?.name ?? "(unknown)";
      const subcategoryCount = categoryData?.subcategories.length ?? 0;

      await logActivity(tx, user.id, {
        entityType: "CATEGORY",
        actionType: "DELETED",
        entityId: id,
        entityName: categoryName,
        message: `Category "${categoryName}" was deleted along with ${subcategoryCount} subcategory(ies)`,
        details: {
          subcategoriesDeleted: subcategoryCount,
        },
      });
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

    const rl = await checkActionRateLimit({
      prefix: "action:categories:bulk-delete:",
      limit: 10,
      windowMs: 60_000,
      userId: user.id,
    });
    if (!rl.allowed) {
      return {
        success: false,
        error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
      };
    }

    const ids = formData.getAll("ids") as string[];

    if (!ids || ids.length === 0) {
      return { success: false, error: "No categories selected" };
    }

    // Get category details for logging
    const categories = await prisma.category.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, subcategories: { select: { id: true } } },
    });

    const result = await prisma.$transaction(async (tx) => {
      const result = await tx.category.deleteMany({
        where: { id: { in: ids } },
      });

      // Log the bulk deletion
      const categoryNames = categories.map((c) => c.name).join(", ");
      const totalSubcategories = categories.reduce(
        (sum, c) => sum + c.subcategories.length,
        0
      );

      await logActivity(tx, user.id, {
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

      return { success: true, deletedCount: result.count };
    });

    // Revalidate affected pages
    revalidatePath("/categories");

    return result;
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
  const rl = await checkActionRateLimit({
    prefix: "action:categories:list:",
    limit: 300,
    windowMs: 60_000,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

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
