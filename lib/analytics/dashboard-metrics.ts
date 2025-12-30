import { DashboardMetrics } from "../domain/dashboard-metrics";
import { AnalyticsPeriod } from "../domain/period";
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
  userId: string,
  period: AnalyticsPeriod = 30
): Promise<StockMovementAnalytics> {
  const [summary, trend, topMovingProducts, trendIndicator] = await Promise.all(
    [
      getStockMovements(userId, period),
      getStockMovementTrend(userId, period),
      getTopMovingProducts(userId, period),
      getStockMovementTrendIndicator(userId, period),
    ]
  );

  return {
    summary,
    trends: trend,
    topMovingProducts,
    trendIndicator,
  };
}
