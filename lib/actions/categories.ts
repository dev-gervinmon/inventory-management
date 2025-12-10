"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import prisma from "../prisma";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

function parseCategoryData(formData: FormData) {
  const parsed = CategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  return parsed.data;
}

export async function createCategory(formData: FormData) {
  const user = await getCurrentUser();
  const data = parseCategoryData(formData);

  try {
    await prisma.category.create({
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Category name already exists");
    }
    console.error("Create category error:", error);
    throw new Error("Failed to create category.");
  }
  redirect("/categories");
}

export async function editCategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Category ID is required");
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const data = parseCategoryData(formData);

  try {
    await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Category name already exists");
    }
    console.error("Edit category error:", error);
    throw new Error("Failed to update category.");
  }
  redirect("/categories");
}

export async function deleteCategory(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Category ID is required");
  }

  try {
    const deleted = await prisma.category.deleteMany({
      where: { id },
    });

    if (deleted.count === 0) {
      throw new Error("Category not found");
    }
  } catch (error) {
    console.error("Delete category error:", error);
    throw new Error("Failed to delete category.");
  }
  redirect("/categories");
}
