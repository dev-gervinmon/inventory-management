import prisma from "../db/prisma";
import { ValueMetrics } from "../domain/dashboard-metrics";

export async function getInventoryValue(userId: string): Promise<ValueMetrics> {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      price: true,
      unitCost: true,
    },
  });

  const totalRetailValue = products.reduce((sum, p) => {
    return sum + Number(p.quantity) * Number(p.price);
  }, 0);

  const productsMissingCost = products.reduce((count, p) => {
    return p.unitCost === null ? count + 1 : count;
  }, 0);

  const totalCostValue = products.reduce((sum, p) => {
    if (p.unitCost === null) return sum;
    return sum + Number(p.quantity) * Number(p.unitCost);
  }, 0);

  const totalPotentialProfit = products.reduce((sum, p) => {
    if (p.unitCost === null) return sum;
    const retail = Number(p.quantity) * Number(p.price);
    const cost = Number(p.quantity) * Number(p.unitCost);
    return sum + (retail - cost);
  }, 0);

  return {
    totalValue: totalRetailValue,
    totalRetailValue,
    totalCostValue,
    totalPotentialProfit,
    productsMissingCost,
  };
}
