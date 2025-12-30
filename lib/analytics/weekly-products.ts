import prisma from "../db/prisma";
import { WeeklyProductStat } from "../domain/dashboard-metrics";

export async function getWeeklyProductStats(
  userId: string
): Promise<WeeklyProductStat[]> {
  const products = await prisma.product.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  const map = new Map<string, number>();

  products.forEach((product) => {
    const date = new Date(product.createdAt);
    const weekKey = `${date.getFullYear()}-W${getWeek(date)}`;
    map.set(weekKey, (map.get(weekKey) || 0) + 1);
  });

  return Array.from(map.entries()).map(([week, products]) => ({
    week,
    products,
  }));
}

function getWeek(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = Number(date) - Number(start);
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}
