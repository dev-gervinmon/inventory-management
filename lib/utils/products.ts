/**
 * Product-related utilities and constants
 */

export const PRODUCT_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 255,
  SKU_MAX: 100,
  PRICE_MIN: 0,
  QUANTITY_MIN: 0,
  LOW_STOCK_MIN: 0,
} as const;

export const PRODUCT_DEFAULTS = {
  LOW_STOCK_THRESHOLD: 5,
} as const;

/**
 * Stock status type
 */
export interface StockStatus {
  label: "In Stock" | "Low Stock" | "Out of Stock";
  color:
    | "bg-green-100 text-green-800"
    | "bg-yellow-100 text-yellow-800"
    | "bg-red-100 text-red-800";
  icon: string;
}

/**
 * Determine stock status based on quantity and low stock threshold
 */
export function getStockStatus(
  quantity: number,
  lowStockAt?: number | null
): StockStatus {
  if (quantity <= 0) {
    return {
      label: "Out of Stock",
      color: "bg-red-100 text-red-800",
      icon: "🔴",
    };
  }
  if (lowStockAt && quantity <= lowStockAt) {
    return {
      label: "Low Stock",
      color: "bg-yellow-100 text-yellow-800",
      icon: "🟡",
    };
  }
  return {
    label: "In Stock",
    color: "bg-green-100 text-green-800",
    icon: "🟢",
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `₱${numPrice.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format product date for display
 */
export function formatProductDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate total inventory value for a product
 */
export function calculateProductValue(
  price: number | string,
  quantity: number
): number {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice * quantity;
}

/**
 * Validate product data
 */
export function validateProductName(name: string): boolean {
  return (
    name.length >= PRODUCT_LIMITS.NAME_MIN &&
    name.length <= PRODUCT_LIMITS.NAME_MAX
  );
}

/**
 * Check if product is critically low on stock
 */
export function isCriticallyLow(
  quantity: number,
  lowStockAt?: number | null
): boolean {
  return (
    quantity === 0 || (lowStockAt !== null && quantity <= (lowStockAt || 0))
  );
}
