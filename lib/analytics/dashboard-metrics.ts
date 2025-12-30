import { getInventoryOverview } from "./inventory-overview";
import { getInventoryValue } from "./inventory-value";
import {
  getStockMovements,
  getTopMovingProducts,
  getStockMovementTrend,
} from "./stock-movement";
import { getStockRiskOverview } from "./stock-risk";
import { getWeeklyProductStats } from "./weekly-products";

export async function getDashboardMetrics(userId: string) {
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

export async function getStockMovementAnalytics(userId: string) {
  const [summary, trend, topMovingProducts] = await Promise.all([
    getStockMovements(userId),
    getStockMovementTrend(userId),
    getTopMovingProducts(userId),
    1,
  ]);

  return {
    summary,
    trends: trend,
    topMovingProducts,
  };
}
