import prisma from "../db/prisma";
import { ValueMetrics } from "../domain/dashboard-metrics";

export async function getInventoryValue(userId: string): Promise<ValueMetrics> {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      price: true,
    },
  });

  const totalValue = products.reduce((sum, p) => {
    return sum + Number(p.quantity) * Number(p.price);
  }, 0);

  return {
    totalValue,
  };
}
