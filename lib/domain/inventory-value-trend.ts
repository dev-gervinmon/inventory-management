import { AnalyticsPeriod } from "./period";

export interface InventoryValueTrendPoint {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  totalRetailValue: number;
  totalCostValue: number;
  totalPotentialProfit: number;
  productsMissingCost: number;
}

export interface InventoryValueTrendIndicator {
  direction: "up" | "down" | "flat";
  percentage: number;
  label: string;
}

export interface InventoryValueTrendAnalytics {
  period: AnalyticsPeriod;
  points: InventoryValueTrendPoint[];
  latest: {
    totalRetailValue: number;
    totalCostValue: number;
    totalPotentialProfit: number;
    productsMissingCost: number;
    snapshotDate: string;
  } | null;
  trendIndicator: InventoryValueTrendIndicator;
}
