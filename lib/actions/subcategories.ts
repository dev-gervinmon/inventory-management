"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { parseSubcategoryData } from "../schemas/subcategories";
import { handlePrismaActionError } from "../errors/actions";
import { actionRequireId } from "../validators/subcategories";

export async function createSubcategory(formData: FormData) {
  const user = await getCurrentUser();
  const data = parseSubcategoryData(formData);

  try {
    await prisma.subcategory.create({
      data,
    });

    revalidatePath("/categories");
    redirect(`/categories/${data.categoryId}`);
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
}

export async function editSubcategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = actionRequireId(formData);

  const data = parseSubcategoryData(formData);

  try {
    await prisma.subcategory.update({
      where: { id },
      data,
    });

    revalidatePath("/categories");
    redirect(`/categories/${data.categoryId}`);
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
  revalidatePath("/categories");
  redirect(`/categories/${data.categoryId}`);
}

export async function deleteSubcategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = actionRequireId(formData);

  try {
    await prisma.subcategory.delete({
      where: { id },
    });

    revalidatePath("/categories");
  } catch (error) {
    handlePrismaActionError(error, "Subcategory");
  }
  revalidatePath("/categories");
  redirect(`/categories`);
}
