import { StockRiskItem } from "@/lib/types/dashboard";

export interface InventoryMetrics {
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockPercentage: number;
  lowStockPercentage: number;
  outOfStockPercentage: number;
}

export interface ValueMetrics {
  totalValue: number;
}

export interface WeeklyProductStat {
  week: string;
  products: number;
}

export interface RiskMetrics {
  totalAtRisk: number;
  outOfStock: number;
  lowStock: number;
  items: StockRiskItem[];
}

export interface DashboardMetrics {
  inventory: InventoryMetrics;
  value: ValueMetrics;
  weeklyProductStats: WeeklyProductStat[];
  risk: RiskMetrics;
}
