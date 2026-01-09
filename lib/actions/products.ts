"use server";

import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseProductData } from "../schemas/products";
import { logActivity } from "./activities";
import { formatPrice } from "../utils/products";
import { createStockMovement } from "../analytics/stock-movement";
import { checkActionRateLimit } from "./rate-limit";

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
): Record<
  string,
  { old: string | number; new: string | number; diff: string | number }
> {
  const changes: Record<
    string,
    { old: string | number; new: string | number; diff: string | number }
  > = {};

  for (const key of Object.keys(oldData)) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: String(oldData[key]),
        new: String(newData[key]),
        diff: Number(newData[key]) - Number(oldData[key]),
      };
    }
  }

  return changes;
}

/**
 * Flatten changes into single-level record for database storage
 */
function flattenChanges(
  changes: Record<
    string,
    { old: string | number; new: string | number; diff: string | number }
  >
): Record<string, string | number | boolean> {
  const flattened: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(changes)) {
    flattened[`${key}_old`] = value.old;
    flattened[`${key}_new`] = value.new;
    flattened[`${key}_diff`] = value.diff;
  }
  return flattened;
}

/**
 * Delete multiple products (bulk delete)
 */
export async function bulkDeleteProducts(ids: string[]) {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:products:bulk-delete:",
    limit: 10,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

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
    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: { id: { in: ids }, userId: user.id },
      });

      // Log activity for bulk delete
      const productNames = products
        .map((p: { id: string; name: string }) => p.name)
        .join(", ");
      await logActivity(tx, user.id, {
        entityType: "PRODUCT",
        actionType: "DELETED",
        entityName: `${products.length} products`,
        message: `Bulk deleted ${products.length} product(s): ${productNames}`,
      });
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

  const rl = await checkActionRateLimit({
    prefix: "action:products:create:",
    limit: 20,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

  const data = parseProductData(formData);
  const categoryIds = extractIdsFromFormData(formData, "categoryIds");
  const subcategoryIds = extractIdsFromFormData(formData, "subcategoryIds");

  try {
    await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
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

      await logActivity(tx, user.id, {
        entityType: "PRODUCT",
        actionType: "ADDED",
        entityId: createdProduct.id,
        entityName: createdProduct.name,
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
    });
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

  const rl = await checkActionRateLimit({
    prefix: "action:products:edit:",
    limit: 60,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

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
      unitCost: true,
      quantity: true,
    },
  });

  if (!oldProduct || oldProduct.userId !== user.id) {
    throw new Error("Product not found or unauthorized");
  }

  const { quantity, ...productData } = parseProductData(formData);
  const categoryIds = extractIdsFromFormData(formData, "categoryIds");
  const subcategoryIds = extractIdsFromFormData(formData, "subcategoryIds");

  try {
    await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          categories: {
            set: categoryIds.map((id) => ({ id })),
          },
          subcategories: {
            set: subcategoryIds.map((id) => ({ id })),
          },
        },
      });

      const quantityChanged =
        typeof quantity === "number" && quantity !== oldProduct.quantity;

      if (quantityChanged) {
        const diff = quantity - oldProduct.quantity;
        await createStockMovement(tx, {
          productId: id,
          quantity: Math.abs(diff),
          direction: diff > 0 ? "IN" : "OUT",
          reason: "ADJUSTMENT",
          source: "USER",
        });

        await logActivity(tx, user.id, {
          entityType: "PRODUCT",
          actionType: "STOCK_UPDATED",
          entityId: id,
          entityName: updatedProduct.name,
          message: `Updated stock for "${updatedProduct.name}"`,
          details: {
            from: oldProduct.quantity,
            to: quantity,
            difference: diff,
          },
        });
      }

      // Track field changes
      const changes = trackFieldChanges(
        {
          name: oldProduct.name,
          price: oldProduct.price.toNumber(),
          unitCost:
            oldProduct.unitCost !== null ? oldProduct.unitCost.toNumber() : "",
        },
        {
          name: updatedProduct.name,
          price: updatedProduct.price.toNumber(),
          unitCost:
            updatedProduct.unitCost !== null
              ? updatedProduct.unitCost.toNumber()
              : "",
        }
      );

      // Only log if something actually changed
      if (Object.keys(changes).length > 0) {
        const flattenedChanges = flattenChanges(changes);

        if (changes.price) {
          await logActivity(tx, user.id, {
            entityType: "PRODUCT",
            actionType: "PRICE_UPDATED",
            entityId: id,
            entityName: updatedProduct.name,
            message: `Updated price for "${updatedProduct.name}": ${formatPrice(
              oldProduct.price.toNumber()
            )} → ${formatPrice(updatedProduct.price.toNumber())}`,
            details: flattenedChanges,
          });
        }

        // Log general edit if other fields changed (but not if only stock/price changed)
        const otherChanges = Object.keys(changes).filter(
          (key) => key !== "quantity" && key !== "price"
        );
        if (otherChanges.length > 0 && !changes.price) {
          await logActivity(tx, user.id, {
            entityType: "PRODUCT",
            actionType: "EDITED",
            entityId: id,
            entityName: updatedProduct.name,
            message: `Updated product "${updatedProduct.name}"`,
            details: flattenedChanges,
          });
        }
      }
    });
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

  const rl = await checkActionRateLimit({
    prefix: "action:products:delete:",
    limit: 30,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

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
    return await prisma.$transaction(async (tx) => {
      await tx.product.delete({
        where: { id },
      });

      // Log the deletion
      await logActivity(tx, user.id, {
        entityType: "PRODUCT",
        actionType: "DELETED",
        entityId: id,
        entityName: product.name,
        message: `Deleted product "${product.name}"`,
      });

      return { success: true };
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to delete product");
  }
}

/**
 * Revert a product to a previous version using activity history
 * Extracts old values from activity details and applies them to the product
 */
export async function revertActivity(
  productId: string,
  activityId: string
): Promise<{ success: boolean; message: string }> {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:products:revert-activity:",
    limit: 15,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

  if (!productId || !activityId) {
    throw new Error("Product ID and Activity ID are required");
  }

  try {
    // Verify product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        userId: true,
        name: true,
        price: true,
        quantity: true,
      },
    });

    if (!product || product.userId !== user.id) {
      throw new Error("Product not found or unauthorized");
    }

    // Get the activity to revert
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity || activity.userId !== user.id) {
      throw new Error("Activity not found or unauthorized");
    }

    // Only allow reverting EDITED activities
    if (
      activity.actionType !== "STOCK_UPDATED" &&
      activity.actionType !== "PRICE_UPDATED" &&
      activity.actionType !== "EDITED"
    ) {
      throw new Error(
        `Cannot revert ${activity.actionType} activities. Only price, stock, and edit changes can be reverted.`
      );
    }

    // Prevent reverting reverts
    if (
      activity.actionType === "EDITED" &&
      activity.message &&
      activity.message.includes("reverted")
    ) {
      throw new Error(
        "This activity is already a revert. Cannot undo a revert this way."
      );
    }

    // Extract old values from activity details
    const details = activity.details as Record<string, unknown>;
    if (!details || Object.keys(details).length === 0) {
      throw new Error(
        "This activity has no change details recorded and cannot be reverted."
      );
    }

    // Build update object from old values
    const updateData: Record<string, unknown> = {};
    let hasChanges = false;

    // Check for quantity changes
    if (details.quantity_old !== undefined) {
      updateData.quantity = Number(details.quantity_old);
      hasChanges = true;
    }

    // Check for price changes
    if (details.price_old !== undefined) {
      updateData.price = details.price_old;
      hasChanges = true;
    }

    // Check for name changes
    if (details.name_old !== undefined) {
      updateData.name = details.name_old;
      hasChanges = true;
    }

    if (!hasChanges) {
      throw new Error(
        "No revertible changes were found in this activity details. The recorded old values may be missing."
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the product with old values
      const revertedProduct = await tx.product.update({
        where: { id: productId },
        data: updateData,
      });

      // Log the revert as a new activity
      const revertedFields = Object.keys(updateData)
        .map((field) => {
          if (field === "quantity") {
            return `quantity: ${product.quantity} → ${details.quantity_old}`;
          } else if (field === "price") {
            return `price: ${formatPrice(
              product.price.toNumber()
            )} → ${formatPrice(Number(details.price_old))}`;
          } else if (field === "name") {
            return `name: ${product.name} → ${details.name_old}`;
          }
          return field;
        })
        .join(", ");

      await logActivity(tx, user.id, {
        entityType: "PRODUCT",
        actionType: "EDITED",
        entityId: productId,
        entityName: revertedProduct.name,
        message: `Reverted "${revertedProduct.name}" to previous version (${revertedFields})`,
        details: {
          reverted_from: activityId,
          timestamp: activity.createdAt.toISOString(),
        },
      });
      return {
        success: true,
        message: `Successfully reverted "${revertedProduct.name}" to previous version`,
      };
    });
    return result;
  } catch (error) {
    console.error("Revert activity error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to revert product");
  }
}
