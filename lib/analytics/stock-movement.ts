import prisma, { PrismaTx } from "../db/prisma";
import { AnalyticsPeriod } from "../domain/period";
import {
  StockDirection,
  StockMovementReason,
  StockMovementSummary,
  StockMovementTrend,
  StockMovementTrendIndicator,
  TopMovingProduct,
} from "../domain/stock-movement";

interface CreateStockMovementInput {
  productId: string;
  quantity: number;
  direction: StockDirection;
  reason: StockMovementReason;
  source?: "USER" | "SYSTEM" | "MARKET";
}

function fillMissingDays(
  data: { date: string; in: number; out: number }[],
  days: number
) {
  const map = new Map(data.map((d) => [d.date, d]));
  const result: { date: string; in: number; out: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = date.toISOString().slice(0, 10);

    result.push(map.get(key) ?? { date: key, in: 0, out: 0 });
  }

  return result;
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export async function getStockMovements(
  userId: string,
  period: AnalyticsPeriod = 30
): Promise<StockMovementSummary> {
  const since = new Date();
  since.setDate(since.getDate() - period);

  const movements = await prisma.stockMovement.findMany({
    where: {
      createdAt: { gte: since },
      product: { userId },
    },
    select: {
      quantity: true,
      direction: true,
    },
  });

  let totalIn = 0;
  let totalOut = 0;

  movements.forEach((movement) => {
    if (movement.direction === "IN") {
      totalIn += movement.quantity;
    } else {
      totalOut += movement.quantity;
    }
  });

  return {
    totalIn,
    totalOut,
    netChange: totalIn - totalOut,
  };
}

export async function getStockMovementTrend(
  userId: string,
  period: AnalyticsPeriod = 14
): Promise<StockMovementTrend[]> {
  const since = new Date();
  since.setDate(since.getDate() - period);

  const movements = await prisma.stockMovement.findMany({
    where: {
      createdAt: { gte: since },
      product: { userId },
    },
    select: {
      quantity: true,
      direction: true,
      createdAt: true,
    },
  });

  const map = new Map<string, { in: number; out: number }>();

  movements.forEach((movement) => {
    const day = movement.createdAt.toISOString().slice(0, 10);

    if (!map.has(day)) {
      map.set(day, { in: 0, out: 0 });
    }

    const entry = map.get(day)!;

    if (movement.direction === "IN") {
      entry.in += movement.quantity;
    } else {
      entry.out += movement.quantity;
    }
  });

  const raw = Array.from(map.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));

  const filled = fillMissingDays(raw, period);
  filled.sort((a, b) => a.date.localeCompare(b.date));
  return filled;
}

export async function getStockMovementTrendIndicator(
  userId: string,
  period: AnalyticsPeriod = 14
): Promise<StockMovementTrendIndicator> {
  const current = await getStockMovements(userId, period);
  const previous = await getStockMovements(userId, period * 2 as AnalyticsPeriod);

  const currentNet = current.netChange;
  const previousNet = previous.netChange - currentNet;

  const change = calculatePercentageChange(currentNet, previousNet);

  let direction: "up" | "down" | "flat" = "flat";
  if (change > 5) direction = "up";
  else if (change < -5) direction = "down";

  return {
    direction,
    percentage: Math.abs(Math.round(change)),
    label:
      direction === "flat"
        ? "No significant change"
        : direction === "up"
        ? "Stock movement increasing"
        : "Stock movement decreasing",
  };
}

export async function getTopMovingProducts(
  userId: string,
  limit = 5,
  period: AnalyticsPeriod = 30
): Promise<TopMovingProduct[]> {
  const since = new Date();
  since.setDate(since.getDate() - period);

  const movements = await prisma.stockMovement.groupBy({
    by: ["productId"],
    where: {
      createdAt: { gte: since },
      product: { userId },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: movements.map((m) => m.productId) } },
    select: { id: true, name: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  return movements.map((m) => ({
    productId: m.productId,
    name: productMap.get(m.productId) || "Unknown",
    totalMoved: m._sum.quantity || 0,
  }));
}

export async function createStockMovement(
  tx: PrismaTx,
  input: CreateStockMovementInput
) {
  const { productId, quantity, direction, reason, source = "SYSTEM" } = input;

  await tx.stockMovement.create({
    data: {
      productId,
      quantity,
      direction,
      reason,
      source,
    },
  });

  const delta = direction === "IN" ? quantity : -quantity;

  await tx.product.update({
    where: { id: productId },
    data: {
      quantity: {
        increment: delta,
      },
    },
  });
}
