import prisma from "../db/prisma";
import { StockRiskItem } from "../types/dashboard";

export async function getStockRiskOverview(userId: string) {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      sku: true,
      quantity: true,
      lowStockAt: true,
    },
  });

  const atRiskItems: StockRiskItem[] = products
    .filter((p) => p.lowStockAt !== null && p.quantity <= (p.lowStockAt ?? 0))
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku ?? "",
      quantity: p.quantity,
      lowStockAt: p.lowStockAt ?? 0,
      severity: p.quantity === 0 ? "out" : "low",
    }));

  return {
    totalAtRisk: atRiskItems.length,
    outOfStock: atRiskItems.filter((item) => item.severity === "out").length,
    lowStock: atRiskItems.filter((item) => item.severity === "low").length,
    items: atRiskItems,
  };
}
