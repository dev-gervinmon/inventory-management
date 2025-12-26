/**
 * Activity-related types
 */

export type EntityType = "PRODUCT" | "CATEGORY" | "SUBCATEGORY";

export type ActionType =
  | "ADDED"
  | "EDITED"
  | "DELETED"
  | "STOCK_UPDATED"
  | "PRICE_UPDATED";

export interface Activity {
  id: string;
  userId: string;
  userName?: string; // User's display name or email
  entityType: EntityType;
  actionType: ActionType;
  entityId: string | null;
  entityName: string;
  message: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}
