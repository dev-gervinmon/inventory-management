/**
 * Dashboard utility functions for calculations and formatting
 */

export const STOCK_THRESHOLDS = {
  LOW_STOCK_DEFAULT: 5,
  IN_STOCK_MIN: 5, // anything > 5 is considered in stock
} as const;

export const DASHBOARD_LIMITS = {
  CRITICAL_ITEMS: 8,
  ACTIVITY_FEED: 8,
  WEEKS_TO_DISPLAY: 12,
} as const;

export interface ActivityType {
  type: string;
  icon: string;
  label: string;
}

export const ACTIVITY_TYPES: Record<string, ActivityType> = {
  PRODUCT_ADDED: {
    type: "PRODUCT_ADDED",
    icon: "➕",
    label: "Added",
  },
  PRODUCT_DELETED: {
    type: "PRODUCT_DELETED",
    icon: "🗑️",
    label: "Deleted",
  },
  STOCK_UPDATED: {
    type: "STOCK_UPDATED",
    icon: "📦",
    label: "Stock Updated",
  },
  PRICE_UPDATED: {
    type: "PRICE_UPDATED",
    icon: "💰",
    label: "Price Updated",
  },
  PRODUCT_EDITED: {
    type: "PRODUCT_EDITED",
    icon: "✏️",
    label: "Edited",
  },
} as const;

/**
 * Format relative time for activity feed (e.g., "5m ago", "2h ago")
 */
export function formatActivityTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Get icon for activity type
 */
export function getActivityIcon(type: string): string {
  return ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES]?.icon || "📝";
}

/**
 * Calculate inventory statistics from products
 */
export function calculateStockStats(
  products: Array<{ quantity: number; lowStockAt: number | null }>
) {
  const total = products.length;

  const inStockCount = products.filter(
    (p) => p.quantity > STOCK_THRESHOLDS.IN_STOCK_MIN
  ).length;
  const lowStockCount = products.filter(
    (p) =>
      p.lowStockAt !== null && p.quantity <= p.lowStockAt && p.quantity >= 1
  ).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  const calculatePercentage = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return {
    inStockCount,
    lowStockCount,
    outOfStockCount,
    inStockPercentage: calculatePercentage(inStockCount),
    lowStockPercentage: calculatePercentage(lowStockCount),
    outOfStockPercentage: calculatePercentage(outOfStockCount),
  };
}

/**
 * Generate weekly product data for chart
 */
export function generateWeeklyProductData(
  products: Array<{ createdAt: Date }>
) {
  const now = new Date();
  const weeklyData = [];

  for (let i = DASHBOARD_LIMITS.WEEKS_TO_DISPLAY - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate()).padStart(2, "0")}`;

    const weekProducts = products.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  return weeklyData;
}

/**
 * Filter and sort critical stock items
 */
export function getCriticalStockItems<
  T extends { quantity: number; lowStockAt: number | null }
>(products: T[], limit: number = DASHBOARD_LIMITS.CRITICAL_ITEMS): T[] {
  return products
    .filter(
      (p) =>
        p.quantity === 0 ||
        p.quantity <= (p.lowStockAt || STOCK_THRESHOLDS.LOW_STOCK_DEFAULT)
    )
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, limit);
}
