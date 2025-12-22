/**
 * Dashboard Empty States
 * Specific empty state components for dashboard sections
 */

import { Activity, Package } from "lucide-react";
import { EmptyState } from "./empty-state";
import AddProductButton from "@/components/buttons/add-product-button";

/**
 * Empty state for critical stock alerts
 * Shows when there are no low or out of stock items
 */
export function EmptyAlertsState() {
  return (
    <EmptyState
      icon={
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-full animate-pulse">
          <svg
            className="w-3/5 h-3/5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      }
      title="All Items Stocked"
      description="Great news! All your inventory items are well stocked and there are no critical alerts."
      compact={true}
    />
  );
}

/**
 * Empty state for recent activity
 * Shows when there are no activity records yet
 */
export function EmptyActivityState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12">
      <div className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mb-4 sm:mb-6 flex items-center justify-center">
        <Activity className="w-full h-full" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        No Activity Yet
      </h3>
      <p className="text-sm sm:text-base text-gray-600 max-w-sm px-4 mb-6 sm:mb-8">
        Your activity log is empty. Start by adding your first product to your
        inventory.
      </p>
      <AddProductButton variant="simple" size="sm" className="justify-center" />
    </div>
  );
}

/**
 * Empty state for no products
 * Shows when user has no products yet
 */
export function EmptyProductsState() {
  return (
    <EmptyState
      icon={
        <Package className="w-full h-full text-purple-400" strokeWidth={1.5} />
      }
      title="No Products Yet"
      description="Get started by adding your first product to your inventory. You can organize them into categories and track stock levels."
      action={{
        label: "Add First Product",
        href: "/add-product",
      }}
    />
  );
}

/**
 * Empty state for dashboard
 * Shows when user has just created their account with no data
 */
export function EmptyDashboardState() {
  return (
    <EmptyState
      icon={
        <Package className="w-full h-full text-indigo-400" strokeWidth={1.5} />
      }
      title="Welcome to Your Dashboard"
      description="Your dashboard will show a complete overview of your inventory once you add your first product. Create a category, then add products to get started."
      action={{
        label: "Add Your First Product",
        href: "/add-product",
      }}
    />
  );
}
