import prisma from "../db/prisma";
import { AnalyticsPeriod } from "../domain/period";
import {
  InventoryHealthTrendAnalytics,
  InventoryHealthTrendIndicator,
  InventoryHealthTrendPoint,
} from "../domain/inventory-health-trend";

function toUtcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function addUtcDays(dateOnly: Date, days: number): Date {
  const d = new Date(dateOnly);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatDateOnly(dateOnly: Date): string {
  return dateOnly.toISOString().slice(0, 10);
}

function percentChange(latest: number | null, previous: number | null): number {
  if (latest === null || previous === null || previous <= 0) return 0;
  return ((latest - previous) / previous) * 100;
}

function computeTrendIndicator(args: {
  latestInStockPct: number | null;
  previousInStockPct: number | null;
}): InventoryHealthTrendIndicator {
  const change = percentChange(args.latestInStockPct, args.previousInStockPct);

  if (Math.abs(change) < 0.01) {
    return { direction: "flat", percentage: 0, label: "vs previous" };
  }

  return {
    direction: change > 0 ? "up" : "down",
    percentage: Math.abs(change),
    label: "vs previous",
  };
}

async function ensureTodaySnapshot(userId: string): Promise<void> {
  const today = toUtcDateOnly(new Date());

  const existing = await prisma.inventoryHealthSnapshot.findUnique({
    where: {
      userId_snapshotDate: {
        userId,
        snapshotDate: today,
      },
    },
    select: { id: true },
  });

  if (existing) return;

  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      lowStockAt: true,
    },
  });

  const totalProducts = products.length;

  let outOfStockCount = 0;
  let lowStockCount = 0;

  for (const product of products) {
    const qty = Number(product.quantity);
    if (qty <= 0) {
      outOfStockCount += 1;
      continue;
    }

    const lowStockAt = product.lowStockAt;
    if (typeof lowStockAt === "number" && qty <= lowStockAt) {
      lowStockCount += 1;
    }
  }

  const inStockCount = Math.max(
    0,
    totalProducts - outOfStockCount - lowStockCount
  );

  await prisma.inventoryHealthSnapshot.create({
    data: {
      userId,
      snapshotDate: today,
      totalProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
    },
  });
}

export async function getInventoryHealthTrendAnalytics(
  userId: string,
  period: AnalyticsPeriod
): Promise<InventoryHealthTrendAnalytics> {
  await ensureTodaySnapshot(userId);

  const today = toUtcDateOnly(new Date());
  const start = addUtcDays(today, -(Number(period) - 1));

  const [snapshots, previousSnapshot] = await Promise.all([
    prisma.inventoryHealthSnapshot.findMany({
      where: {
        userId,
        snapshotDate: {
          gte: start,
          lte: today,
        },
      },
      orderBy: { snapshotDate: "asc" },
    }),
    prisma.inventoryHealthSnapshot.findFirst({
      where: {
        userId,
        snapshotDate: {
          lt: start,
        },
      },
      orderBy: { snapshotDate: "desc" },
    }),
  ]);

  const points: InventoryHealthTrendPoint[] = snapshots.map((s) => ({
    date: formatDateOnly(toUtcDateOnly(s.snapshotDate)),
    totalProducts: s.totalProducts,
    inStockCount: s.inStockCount,
    lowStockCount: s.lowStockCount,
    outOfStockCount: s.outOfStockCount,
  }));

  const latestRaw =
    snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  const latest = latestRaw
    ? {
        snapshotDate: formatDateOnly(toUtcDateOnly(latestRaw.snapshotDate)),
        totalProducts: latestRaw.totalProducts,
        inStockCount: latestRaw.inStockCount,
        lowStockCount: latestRaw.lowStockCount,
        outOfStockCount: latestRaw.outOfStockCount,
        inStockPercentage:
          latestRaw.totalProducts > 0
            ? (latestRaw.inStockCount / latestRaw.totalProducts) * 100
            : 0,
      }
    : null;

  const previousInStockPercentage = previousSnapshot
    ? previousSnapshot.totalProducts > 0
      ? (previousSnapshot.inStockCount / previousSnapshot.totalProducts) * 100
      : 0
    : null;

  const trendIndicator = computeTrendIndicator({
    latestInStockPct: latest ? latest.inStockPercentage : null,
    previousInStockPct: previousInStockPercentage,
  });

  return {
    period,
    points,
    latest,
    trendIndicator,
  };
}
