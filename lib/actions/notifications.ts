"use server";

import prisma from "../db/prisma";

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

export async function getCriticalStockItems(userId: string, limit = 10) {
  try {
    return await prisma.product.findMany({
      where: {
        userId,
        lowStockAt: {
          not: null,
        },
        OR: [
          { quantity: 0 },
          {
            quantity: {
              lte: prisma.product.fields.lowStockAt,
            },
          },
        ],
      },
      select: {
        id: true,
        price: true,
        quantity: true,
        lowStockAt: true,
        createdAt: true,
        sku: true,
        name: true,
      },
      orderBy: {
        quantity: "asc",
      },
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch critical stock items:", error);
    return [];
  }
}
