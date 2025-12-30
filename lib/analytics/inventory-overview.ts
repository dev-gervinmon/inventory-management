import prisma from "../db/prisma";
import { InventoryMetrics } from "../domain/dashboard-metrics";

export async function getInventoryOverview(
  userId: string
): Promise<InventoryMetrics> {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      lowStockAt: true,
    },
  });

  let inStock = 0;
  let outOfStock = 0;
  let lowStock = 0;

  products.forEach((product) => {
    if (product.quantity === 0) {
      outOfStock += 1;
    } else if (
      product.lowStockAt !== null &&
      product.quantity <= product.lowStockAt
    ) {
      lowStock += 1;
    } else {
      inStock += 1;
    }
  });

  const total = products.length || 1;

  return {
    totalProducts: products.length,
    inStockCount: inStock,
    lowStockCount: lowStock,
    outOfStockCount: outOfStock,
    inStockPercentage: Math.round((inStock / total) * 100),
    lowStockPercentage: Math.round((lowStock / total) * 100),
    outOfStockPercentage: Math.round((outOfStock / total) * 100),
  };
}
