export type StockDirection = "IN" | "OUT";

export type StockMovementReason =
  | "SALE"
  | "REFILL"
  | "ADJUSTMENT"
  | "RETURN"
  | "DELIVERY"
  | "MARKET_SYNC"
  | "REVERT";

export interface StockMovement {
  productId: string;
  quantity: number;
  direction: StockDirection;
  reason: StockMovementReason;
  source?: "USER" | "SYSTEM" | "MARKET";
  occuredAt: Date;
}

export interface StockMovementSummary {
  totalIn: number;
  totalOut: number;
  netChange: number;
}

export interface StockMovementTrend {
  date: string;
  in: number;
  out: number;
}

export interface TopMovingProduct {
  productId: string;
  name: string;
  totalMoved: number;
}

export interface NonMovingProduct {
  productId: string;
  name: string;
}

export interface StockMovementTrendIndicator {
  direction: "up" | "down" | "flat";
  percentage: number;
  label: string;
}

export interface StockMovementAnalytics {
  summary: StockMovementSummary;
  trends: StockMovementTrend[];
  topMovingProducts: TopMovingProduct[];
  nonMovingProducts: NonMovingProduct[];
  trendIndicator: StockMovementTrendIndicator;
}
