import { DashboardMetrics } from "../domain/dashboard-metrics";
import { StockMovementAnalytics } from "../domain/stock-movement";
import { getInventoryOverview } from "./inventory-overview";
import { getInventoryValue } from "./inventory-value";
import {
  getStockMovements,
  getTopMovingProducts,
  getStockMovementTrend,
  getStockMovementTrendIndicator,
} from "./stock-movement";
import { getStockRiskOverview } from "./stock-risk";
import { getWeeklyProductStats } from "./weekly-products";

export async function getDashboardMetrics(
  userId: string
): Promise<DashboardMetrics> {
  const [inventory, value, weeklyProductStats, risk] = await Promise.all([
    getInventoryOverview(userId),
    getInventoryValue(userId),
    getWeeklyProductStats(userId),
    getStockRiskOverview(userId),
  ]);

  return {
    inventory,
    value,
    weeklyProductStats,
    risk,
  };
}

export async function getStockMovementAnalytics(
  userId: string
): Promise<StockMovementAnalytics> {
  const [summary, trend, topMovingProducts, trendIndicator] = await Promise.all(
    [
      getStockMovements(userId),
      getStockMovementTrend(userId),
      getTopMovingProducts(userId),
      getStockMovementTrendIndicator(userId),
    ]
  );

  return {
    summary,
    trends: trend,
    topMovingProducts,
    trendIndicator,
  };
}
