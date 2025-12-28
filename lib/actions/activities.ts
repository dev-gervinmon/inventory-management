"use server";

import prisma from "@/lib/db/prisma";

export interface ActivityLog {
  entityType: "PRODUCT" | "CATEGORY" | "SUBCATEGORY";
  actionType:
    | "ADDED"
    | "EDITED"
    | "DELETED"
    | "STOCK_UPDATED"
    | "PRICE_UPDATED";
  entityId?: string;
  entityName: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

export async function logActivity(userId: string, activity: ActivityLog) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        entityType: activity.entityType,
        actionType: activity.actionType,
        entityId: activity.entityId || null,
        entityName: activity.entityName,
        message: activity.message,
        details: activity.details || {},
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging should not break the main operation
  }
}
