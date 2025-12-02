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
});

function parseProductData(formData: FormData) {
  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  return parsed.data;
}

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Product ID is required");
  }

  try {
    const deleted = await prisma.product.deleteMany({
      where: { id, userId: user.id },
    });

    if (deleted.count === 0) {
      throw new Error("Product not found or unauthorized");
    }
  } catch (error) {
    throw new Error("Failed to delete product.");
  }
}

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  const data = parseProductData(formData);

  try {
    await prisma.product.create({
      data: { ...data, userId: user.id },
    });
  } catch (error) {
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

  try {
    await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      throw new Error("SKU already exists");
    }
    throw new Error("Failed to update product.");
  }

  redirect("/inventory");
}
