"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import prisma from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().optional(),
});

function parseProductData(formData: FormData) {
  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
    imageUrl: formData.get("image") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  return parsed.data;
}

function getCategoryIds(formData: FormData): string[] {
  const categoryIds = formData.getAll("categoryIds");
  return categoryIds.filter((id) => typeof id === "string") as string[];
}

export async function deleteProduct(id: string) {
  const user = await getCurrentUser();

  if (!id) {
    throw new Error("Product ID is required");
  }

  try {
    const result = await prisma.product.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      throw new Error("Product not found or unauthorized");
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete product");
  }
}

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  const data = parseProductData(formData);
  const categoryIds = getCategoryIds(formData);

  try {
    await prisma.product.create({
      data: {
        ...data,
        userId: user.id,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    throw new Error("Failed to create product.");
  }
  redirect("/inventory");
}

export async function editProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Product ID is required");
  }

  // Verify product exists and belongs to user
  const product = await prisma.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product || product.userId !== user.id) {
    throw new Error("Product not found or unauthorized");
  }

  const data = parseProductData(formData);
  const categoryIds = getCategoryIds(formData);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("SKU already exists");
    }
    throw new Error("Failed to update product.");
  }

  redirect("/inventory");
}
