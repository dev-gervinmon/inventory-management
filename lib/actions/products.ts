"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseProductData } from "../schemas/products";
import { logActivity } from "./activities";
import { formatPrice } from "../utils/products";

const INVENTORY_PATH = "/inventory";

/**
 * Extract IDs from FormData for a given key
 */
function extractIdsFromFormData(formData: FormData, key: string): string[] {
  const ids = formData.getAll(key);
  return ids.filter((id) => typeof id === "string") as string[];
}

/**
 * Track product field changes and flatten for storage
 */
function trackFieldChanges(
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
): Record<string, { old: string | number; new: string | number }> {
  const changes: Record<
    string,
    { old: string | number; new: string | number }
  > = {};

  for (const key of Object.keys(oldData)) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: String(oldData[key]),
        new: String(newData[key]),
      };
    }
  }

  return changes;
}

/**
 * Flatten changes into single-level record for database storage
 */
function flattenChanges(
  changes: Record<string, { old: string | number; new: string | number }>
): Record<string, string | number | boolean> {
  const flattened: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(changes)) {
    flattened[`${key}_old`] = value.old;
    flattened[`${key}_new`] = value.new;
  }
  return flattened;
}

/**
 * Delete multiple products (bulk delete)
 */
export async function bulkDeleteProducts(ids: string[]) {
  const user = await getCurrentUser();

  if (!ids || ids.length === 0) {
    throw new Error("No products selected");
  }

  try {
    // Get product names for logging
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, userId: user.id },
      select: { id: true, name: true },
    });

    if (products.length === 0) {
      throw new Error("No products found or unauthorized");
    }

    // Delete all products
    await prisma.product.deleteMany({
      where: { id: { in: ids }, userId: user.id },
    });

    // Log activity for bulk delete
    const productNames = products
      .map((p: { id: string; name: string }) => p.name)
      .join(", ");
    await logActivity(user.id, {
      type: "PRODUCT_DELETED",
      productName: `${products.length} products`,
      message: `Bulk deleted ${products.length} product(s): ${productNames}`,
    });

    return { success: true, deletedCount: products.length };
  } catch (error) {
    console.error("Bulk delete error:", error);
    throw new Error("Failed to delete products");
  }
}

/**
 * Create a new product
 */
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
      message: `Added new product "${createdProduct.name}" (${formatPrice(
        createdProduct.price.toNumber()
      )})`,
      details: {
        sku: createdProduct.sku || "",
        price: createdProduct.price.toNumber(),
        quantity: createdProduct.quantity,
      },
    });

    return { success: true, productId: createdProduct.id };
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    throw new Error("Failed to create product.");
  }
}

/**
 * Update an existing product
 */
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

    // Track field changes
    const changes = trackFieldChanges(
      {
        name: oldProduct.name,
        price: oldProduct.price.toNumber(),
        quantity: oldProduct.quantity,
      },
      {
        name: updatedProduct.name,
        price: updatedProduct.price.toNumber(),
        quantity: updatedProduct.quantity,
      }
    );

    // Only log if something actually changed
    if (Object.keys(changes).length > 0) {
      const flattenedChanges = flattenChanges(changes);

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
          message: `Updated price for "${updatedProduct.name}": ${formatPrice(
            oldProduct.price.toNumber()
          )} → ${formatPrice(updatedProduct.price.toNumber())}`,
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
}

/**
 * Delete a single product
 */
export async function deleteProduct(id: string) {
  const user = await getCurrentUser();

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      userId: true,
      name: true,
    },
  });

  if (!product || product.userId !== user.id) {
    throw new Error("Product not found or unauthorized");
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    // Log the deletion
    await logActivity(user.id, {
      type: "PRODUCT_DELETED",
      productId: id,
      productName: product.name,
      message: `Deleted product "${product.name}"`,
      details: {},
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to delete product");
  }
}
