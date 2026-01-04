import prisma from "../db/prisma";
import { AnalyticsPeriod } from "../domain/period";
import {
  InventoryValueTrendAnalytics,
  InventoryValueTrendIndicator,
  InventoryValueTrendPoint,
} from "../domain/inventory-value-trend";
import { getInventoryValue } from "./inventory-value";

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

function computeTrendIndicator(args: {
  latestRetail: number | null;
  previousRetail: number | null;
}): InventoryValueTrendIndicator {
  const { latestRetail, previousRetail } = args;

  if (latestRetail === null || previousRetail === null || previousRetail <= 0) {
    return { direction: "flat", percentage: 0, label: "vs previous" };
  }

  const change = latestRetail - previousRetail;
  const percentage = (change / previousRetail) * 100;

  if (Math.abs(percentage) < 0.01) {
    return { direction: "flat", percentage: 0, label: "vs previous" };
  }

  return {
    direction: percentage > 0 ? "up" : "down",
    percentage: Math.abs(percentage),
    label: "vs previous",
  };
}

async function ensureTodaySnapshot(userId: string): Promise<void> {
  const today = toUtcDateOnly(new Date());

  const existing = await prisma.inventoryValueSnapshot.findUnique({
    where: {
      userId_snapshotDate: {
        userId,
        snapshotDate: today,
      },
    },
    select: { id: true },
  });

  if (existing) return;

  const value = await getInventoryValue(userId);

  await prisma.inventoryValueSnapshot.create({
    data: {
      userId,
      snapshotDate: today,
      totalRetailValue: value.totalRetailValue.toFixed(2),
      totalCostValue: value.totalCostValue.toFixed(2),
      totalPotentialProfit: value.totalPotentialProfit.toFixed(2),
      productsMissingCost: value.productsMissingCost,
    },
  });
}

export async function getInventoryValueTrendAnalytics(
  userId: string,
  period: AnalyticsPeriod
): Promise<InventoryValueTrendAnalytics> {
  await ensureTodaySnapshot(userId);

  const today = toUtcDateOnly(new Date());
  const start = addUtcDays(today, -(Number(period) - 1));

  const [snapshots, previousSnapshot] = await Promise.all([
    prisma.inventoryValueSnapshot.findMany({
      where: {
        userId,
        snapshotDate: {
          gte: start,
          lte: today,
        },
      },
      orderBy: { snapshotDate: "asc" },
    }),
    prisma.inventoryValueSnapshot.findFirst({
      where: {
        userId,
        snapshotDate: {
          lt: start,
        },
      },
      orderBy: { snapshotDate: "desc" },
    }),
  ]);

  const points: InventoryValueTrendPoint[] = snapshots.map((s) => ({
    date: formatDateOnly(toUtcDateOnly(s.snapshotDate)),
    totalRetailValue: Number(s.totalRetailValue),
    totalCostValue: Number(s.totalCostValue),
    totalPotentialProfit: Number(s.totalPotentialProfit),
    productsMissingCost: s.productsMissingCost,
  }));

  const latest = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  const trendIndicator = computeTrendIndicator({
    latestRetail: latest ? Number(latest.totalRetailValue) : null,
    previousRetail: previousSnapshot
      ? Number(previousSnapshot.totalRetailValue)
      : null,
  });

  return {
    period,
    points,
    latest: latest
      ? {
          totalRetailValue: Number(latest.totalRetailValue),
          totalCostValue: Number(latest.totalCostValue),
          totalPotentialProfit: Number(latest.totalPotentialProfit),
          productsMissingCost: latest.productsMissingCost,
          snapshotDate: formatDateOnly(toUtcDateOnly(latest.snapshotDate)),
        }
      : null,
    trendIndicator,
  };
}
