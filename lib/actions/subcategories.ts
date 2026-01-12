"use server";

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import { parseSubcategoryData } from "../schemas/subcategories";
import { actionRequireId } from "../validators/common";
import { logActivity } from "./activities";
import { checkActionRateLimit } from "./rate-limit";

const CATEGORIES_PATH = "/categories";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type SubcategoryPayload = {
  id: string;
  name: string;
  createdAt: Date;
  categoryId: string;
};

type BulkDeletePayload = {
  deletedCount: number;
};

/**
 * Create a new subcategory
 */
export async function createSubcategory(
  formData: FormData
): Promise<ActionResult<SubcategoryPayload>> {
  try {
    const user = await getCurrentUser();

    const rl = await checkActionRateLimit({
      prefix: "action:subcategories:create:",
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

    const data = parseSubcategoryData(formData);

    const result: ActionResult<SubcategoryPayload> = await prisma.$transaction(
      async (tx) => {
        const createdSubcategory = await tx.subcategory.create({ data });

        // Log the activity
        const category = await tx.category.findUnique({
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

        return {
          success: true,
          data: {
            id: createdSubcategory.id,
            name: createdSubcategory.name,
            createdAt: createdSubcategory.createdAt,
            categoryId: createdSubcategory.categoryId,
          },
        };
      }
    );

    revalidatePath(CATEGORIES_PATH);
    return result;
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
export async function editSubcategory(
  formData: FormData
): Promise<ActionResult<SubcategoryPayload>> {
  try {
    const user = await getCurrentUser();

    const rl = await checkActionRateLimit({
      prefix: "action:subcategories:edit:",
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
    const data = parseSubcategoryData(formData);

    const oldSubcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: { name: true, categoryId: true },
    });

    const result: ActionResult<SubcategoryPayload> = await prisma.$transaction(
      async (tx) => {
        const updatedSubcategory = await tx.subcategory.update({
          where: { id },
          data,
        });

        // Log if name changed
        if (oldSubcategory?.name !== data.name) {
          const category = await tx.category.findUnique({
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

        return {
          success: true,
          data: {
            id: updatedSubcategory.id,
            name: updatedSubcategory.name,
            createdAt: updatedSubcategory.createdAt,
            categoryId: updatedSubcategory.categoryId,
          },
        };
      }
    );

    revalidatePath(CATEGORIES_PATH);
    return result;
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

    const rl = await checkActionRateLimit({
      prefix: "action:subcategories:delete:",
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
      await tx.subcategory.delete({ where: { id } });

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

    revalidatePath(CATEGORIES_PATH);

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
export async function deleteBulkSubcategories(
  formData: FormData
): Promise<ActionResult<BulkDeletePayload>> {
  try {
    const user = await getCurrentUser();

    const rl = await checkActionRateLimit({
      prefix: "action:subcategories:bulk-delete:",
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

    const result: ActionResult<BulkDeletePayload> = await prisma.$transaction(
      async (tx) => {
        const result = await tx.subcategory.deleteMany({
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

        return { success: true, data: { deletedCount: result.count } };
      }
    );

    revalidatePath(CATEGORIES_PATH);
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete subcategories";
    return { success: false, error: errorMessage };
  }
}
