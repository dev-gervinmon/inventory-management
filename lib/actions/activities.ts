"use server";

import prisma from "@/lib/db/prisma";

export interface ActivityLog {
  type:
    | "PRODUCT_ADDED"
    | "PRODUCT_EDITED"
    | "PRODUCT_DELETED"
    | "STOCK_UPDATED"
    | "PRICE_UPDATED"
    | "CATEGORY_ADDED"
    | "CATEGORY_EDITED"
    | "CATEGORY_DELETED"
    | "SUBCATEGORY_ADDED"
    | "SUBCATEGORY_EDITED"
    | "SUBCATEGORY_DELETED";
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

export async function logActivity(userId: string, activity: ActivityLog) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type: activity.type,
        productId: activity.productId,
        productName: activity.productName || "",
        message: activity.message,
        details: {
          ...activity.details,
          categoryId: activity.categoryId,
          categoryName: activity.categoryName,
          subcategoryId: activity.subcategoryId,
          subcategoryName: activity.subcategoryName,
        },
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging should not break the main operation
  }
}

export async function getRecentActivities(userId: string, limit = 10) {
  try {
    return await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}
