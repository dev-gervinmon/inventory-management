"use server";

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import { parseSubcategoryData } from "../schemas/subcategories";
import { actionRequireId } from "../validators/subcategories";

const CATEGORIES_PATH = "/categories";

/**
 * Create a new subcategory
 */
export async function createSubcategory(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await getCurrentUser();
    const data = parseSubcategoryData(formData);

    await prisma.subcategory.create({ data });
    revalidatePath(CATEGORIES_PATH);
    return { success: true };
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
): Promise<{ success: boolean; error?: string }> {
  try {
    await getCurrentUser();
    const id = actionRequireId(formData);
    const data = parseSubcategoryData(formData);

    await prisma.subcategory.update({
      where: { id },
      data,
    });
    revalidatePath(CATEGORIES_PATH);
    return { success: true };
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
): Promise<{ success: boolean; error?: string }> {
  try {
    await getCurrentUser();
    const id = actionRequireId(formData);
    const categoryId = String(formData.get("categoryId") || "").trim();
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    await prisma.subcategory.delete({ where: { id } });
    return { success: true };
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
): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  try {
    await getCurrentUser();
    const ids = formData.getAll("ids") as string[];
    const categoryId = String(formData.get("categoryId") || "").trim();

    if (!ids || ids.length === 0) {
      return { success: false, error: "No subcategories selected" };
    }

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const result = await prisma.subcategory.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(CATEGORIES_PATH);
    return { success: true, deletedCount: result.count };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete subcategories";
    return { success: false, error: errorMessage };
  }
}
