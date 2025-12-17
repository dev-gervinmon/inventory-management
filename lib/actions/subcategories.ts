"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { parseSubcategoryData } from "../schemas/subcategories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/subcategories";

const CATEGORIES_PATH = "/categories";

/**
 * Create a new subcategory
 */
export async function createSubcategory(formData: FormData) {
  await getCurrentUser();
  const data = parseSubcategoryData(formData);

  try {
    await prisma.subcategory.create({ data });
    revalidatePath(CATEGORIES_PATH);
    redirect(`${CATEGORIES_PATH}/${data.categoryId}`);
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
}

/**
 * Update an existing subcategory
 */
export async function editSubcategory(formData: FormData) {
  await getCurrentUser();
  const id = actionRequireId(formData);
  const data = parseSubcategoryData(formData);

  try {
    await prisma.subcategory.update({
      where: { id },
      data,
    });
    revalidatePath(CATEGORIES_PATH);
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
}

/**
 * Delete a subcategory
 */
export async function deleteSubcategory(formData: FormData) {
  await getCurrentUser();
  const id = actionRequireId(formData);

  try {
    await prisma.subcategory.delete({ where: { id } });
    revalidatePath(CATEGORIES_PATH);
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
}
