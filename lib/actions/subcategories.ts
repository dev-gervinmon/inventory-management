"use server";

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import { parseSubcategoryData } from "../schemas/subcategories";
import { actionRequireId } from "../validators/subcategories";
import { logActivity } from "./activities";

const CATEGORIES_PATH = "/categories";

/**
 * Create a new subcategory
 */
export async function createSubcategory(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const data = parseSubcategoryData(formData);

    await prisma.$transaction(async (tx) => {
      const createdSubcategory = await prisma.subcategory.create({ data });

      // Log the activity
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { name: true },
      });

      await logActivity(tx, user.id, {
        entityType: "SUBCATEGORY",
        actionType: "ADDED",
        entityId: createdSubcategory.id,
        entityName: createdSubcategory.name,
        message: `Subcategory "${createdSubcategory.name}" was created in category "${category?.name}"`,
        details: {
          categoryId: data.categoryId,
          categoryName: category?.name || "",
        },
      });

      revalidatePath(CATEGORIES_PATH);
      return {
        success: true,
        data: {
          id: createdSubcategory.id,
          name: createdSubcategory.name,
          createdAt: createdSubcategory.createdAt,
          categoryId: createdSubcategory.categoryId,
        },
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A subcategory with this name already exists in this category",
      };
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create subcategory";
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing subcategory
 */
export async function editSubcategory(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const id = actionRequireId(formData);
    const data = parseSubcategoryData(formData);

    const oldSubcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: { name: true, categoryId: true },
    });

    await prisma.$transaction(async (tx) => {
      const updatedSubcategory = await prisma.subcategory.update({
        where: { id },
        data,
      });

      // Log if name changed
      if (oldSubcategory?.name !== data.name) {
        const category = await prisma.category.findUnique({
          where: { id: oldSubcategory?.categoryId || "" },
          select: { name: true },
        });

        await logActivity(tx, user.id, {
          entityType: "SUBCATEGORY",
          actionType: "EDITED",
          entityId: id,
          entityName: updatedSubcategory.name,
          message: `Subcategory name changed from "${oldSubcategory?.name}" to "${updatedSubcategory.name}" in category "${category?.name}"`,
          details: {
            oldName: oldSubcategory?.name || "",
            newName: updatedSubcategory.name,
            categoryId: oldSubcategory?.categoryId || "",
            categoryName: category?.name || "",
          },
        });
      }

      revalidatePath(CATEGORIES_PATH);
      return {
        success: true,
        data: {
          id: updatedSubcategory.id,
          name: updatedSubcategory.name,
          createdAt: updatedSubcategory.createdAt,
          categoryId: updatedSubcategory.categoryId,
        },
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A subcategory with this name already exists in this category",
      };
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update subcategory";
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a subcategory
 */
export async function deleteSubcategory(
  formData: FormData
): Promise<{ success: boolean; error?: string; deletedId?: string }> {
  try {
    const user = await getCurrentUser();
    const id = actionRequireId(formData);
    const categoryId = String(formData.get("categoryId") || "").trim();
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const subcategoryData = await prisma.subcategory.findUnique({
      where: { id },
      select: { name: true },
    });

    const categoryData = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    await prisma.$transaction(async (tx) => {
      await prisma.subcategory.delete({ where: { id } });

      // Log the deletion
      await logActivity(tx, user.id, {
        entityType: "SUBCATEGORY",
        actionType: "DELETED",
        entityId: id,
        entityName: subcategoryData?.name || "",
        message: `Subcategory "${subcategoryData?.name}" was deleted from category "${categoryData?.name}"`,
        details: {
          categoryId,
          categoryName: categoryData?.name || "",
        },
      });
    });

    return { success: true, deletedId: id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete subcategory";
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete multiple subcategories at once
 */
export async function deleteBulkSubcategories(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const ids = formData.getAll("ids") as string[];
    const categoryId = String(formData.get("categoryId") || "").trim();

    if (!ids || ids.length === 0) {
      return { success: false, error: "No subcategories selected" };
    }

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    // Get subcategory and category details for logging
    const subcategories = await prisma.subcategory.findMany({
      where: { id: { in: ids } },
      select: { name: true },
    });

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    await prisma.$transaction(async (tx) => {
      const result = await prisma.subcategory.deleteMany({
        where: { id: { in: ids } },
      });

      // Log the bulk deletion
      await logActivity(tx, user.id, {
        entityType: "SUBCATEGORY",
        actionType: "DELETED",
        entityName: `${result.count} subcategory(ies)`,
        message: `${result.count} subcategory(ies) were deleted from category "${category?.name}"`,
        details: {
          categoryId,
          categoryName: category?.name || "",
          deletedCount: result.count,
          deletedNames: subcategories.map((s) => s.name).join(", "),
        },
      });

      revalidatePath(CATEGORIES_PATH);
      return { success: true, deletedCount: result.count };
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete subcategories";
    return { success: false, error: errorMessage };
  }
}
