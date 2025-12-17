"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import prisma from "../prisma";
import { parseProductData } from "../schemas/products";
import { logActivity } from "./activities";

/**
 * Extract IDs from FormData for a given key
 */
function extractIdsFromFormData(formData: FormData, key: string): string[] {
  const ids = formData.getAll(key);
  return ids.filter((id) => typeof id === "string") as string[];
}

export async function deleteProduct(id: string) {
  const user = await getCurrentUser();

  if (!id) {
    throw new Error("Product ID is required");
  }

  try {
    // Get product info before deleting for the log
    const product = await prisma.product.findUnique({
      where: { id },
      select: { userId: true, name: true },
    });

    if (!product || product.userId !== user.id) {
      throw new Error("Product not found or unauthorized");
    }

    const result = await prisma.product.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count > 0) {
      await logActivity(user.id, {
        type: "PRODUCT_DELETED",
        productId: id,
        productName: product.name,
        message: `Deleted product "${product.name}"`,
      });
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
  const categoryIds = extractIdsFromFormData(formData, "categoryIds");
  const subcategoryIds = extractIdsFromFormData(formData, "subcategoryIds");

  try {
    const createdProduct = await prisma.product.create({
      data: {
        ...data,
        userId: user.id,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        subcategories: {
          connect: subcategoryIds.map((id) => ({ id })),
        },
      },
    });

    await logActivity(user.id, {
      type: "PRODUCT_ADDED",
      productId: createdProduct.id,
      productName: createdProduct.name,
      message: `Added new product "${createdProduct.name}" (₱${createdProduct.price})`,
      details: {
        sku: createdProduct.sku || "",
        price: createdProduct.price.toNumber(),
        quantity: createdProduct.quantity,
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

  // Verify product exists and belongs to user and get old data
  const oldProduct = await prisma.product.findUnique({
    where: { id },
    select: {
      userId: true,
      name: true,
      price: true,
      quantity: true,
      sku: true,
    },
  });

  if (!oldProduct || oldProduct.userId !== user.id) {
    throw new Error("Product not found or unauthorized");
  }

  const data = parseProductData(formData);
  const categoryIds = extractIdsFromFormData(formData, "categoryIds");
  const subcategoryIds = extractIdsFromFormData(formData, "subcategoryIds");

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
        subcategories: {
          set: subcategoryIds.map((id) => ({ id })),
        },
      },
    });

    // Track which fields changed
    const changes: Record<string, { old: string | number; new: string | number }> = {};

    if (oldProduct.name !== updatedProduct.name) {
      changes.name = { old: oldProduct.name, new: updatedProduct.name };
    }
    if (oldProduct.price !== updatedProduct.price) {
      changes.price = {
        old: oldProduct.price.toNumber(),
        new: updatedProduct.price.toNumber(),
      };
    }
    if (oldProduct.quantity !== updatedProduct.quantity) {
      changes.quantity = {
        old: oldProduct.quantity,
        new: updatedProduct.quantity,
      };
    }

    // Only log if something actually changed
    if (Object.keys(changes).length > 0) {
      // Flatten changes for database storage
      const flattenedChanges: Record<string, string | number | boolean> = {};
      for (const [key, value] of Object.entries(changes)) {
        flattenedChanges[`${key}_old`] = value.old;
        flattenedChanges[`${key}_new`] = value.new;
      }

      // Prioritize which type of change to log (stock > price > other)
      if (changes.quantity) {
        await logActivity(user.id, {
          type: "STOCK_UPDATED",
          productId: id,
          productName: updatedProduct.name,
          message: `Updated stock for "${updatedProduct.name}": ${oldProduct.quantity} → ${updatedProduct.quantity} units`,
          details: flattenedChanges,
        });
      } else if (changes.price) {
        await logActivity(user.id, {
          type: "PRICE_UPDATED",
          productId: id,
          productName: updatedProduct.name,
          message: `Updated price for "${updatedProduct.name}": ₱${oldProduct.price} → ₱${updatedProduct.price}`,
          details: flattenedChanges,
        });
      } else {
        await logActivity(user.id, {
          type: "PRODUCT_EDITED",
          productId: id,
          productName: updatedProduct.name,
          message: `Updated product "${updatedProduct.name}"`,
          details: flattenedChanges,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("SKU already exists");
    }
    throw new Error("Failed to update product.");
  }

  redirect("/inventory");
}
