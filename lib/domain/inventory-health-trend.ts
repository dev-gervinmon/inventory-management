import { AnalyticsPeriod } from "./period";

export interface InventoryHealthTrendPoint {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryHealthTrendIndicator {
  direction: "up" | "down" | "flat";
  percentage: number;
  label: string;
}

export interface InventoryHealthTrendAnalytics {
  period: AnalyticsPeriod;
  points: InventoryHealthTrendPoint[];
  latest: {
    snapshotDate: string;
    totalProducts: number;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    inStockPercentage: number;
  } | null;
  trendIndicator: InventoryHealthTrendIndicator;
}
