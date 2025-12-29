import { getInventoryOverview } from "./inventory-overview";
import { getInventoryValue } from "./inventory-value";
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
