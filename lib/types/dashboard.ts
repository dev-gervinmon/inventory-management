export type StockSeverity = "out" | "low";

export interface StockRiskItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockAt: number;
  severity: StockSeverity;
}
