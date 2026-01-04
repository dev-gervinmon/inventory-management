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
  /** Backward-compatible alias (retail value). */
  totalValue: number;
  /** Sum of quantity * price. */
  totalRetailValue: number;
  /** Sum of quantity * unitCost (unitCost must be set). */
  totalCostValue: number;
  /** Retail - Cost (only includes products with unitCost set). */
  totalPotentialProfit: number;
  /** Count of products missing unitCost (null). */
  productsMissingCost: number;
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
  risk: RiskMetrics;
}
