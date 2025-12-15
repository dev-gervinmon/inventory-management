"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import prisma from "../prisma";
import { parseCategoryData } from "../schemas/categories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/categories";

export async function createCategory(formData: FormData) {
  const user = await getCurrentUser();
  const data = parseCategoryData(formData);

  try {
    await prisma.category.create({
      data,
    });
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}

export async function editCategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = actionRequireId(formData);

  const data = parseCategoryData(formData);

  try {
    await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}

export async function deleteCategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = actionRequireId(formData);

  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    handlePrismaActionError(error, "Category");
  }
  redirect("/categories");
}
