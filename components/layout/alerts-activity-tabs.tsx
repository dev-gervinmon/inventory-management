"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AlertCircle, Activity } from "lucide-react";
import { formatActivityTime, getActivityIcon } from "@/lib/utils/dashboard";
import {
  useSwipeGesture,
  type SwipeDirection,
} from "@/lib/hooks/useSwipeGesture";
import {
  EmptyAlertsState,
  EmptyActivityState,
} from "@/components/empty-states";

interface Product {
  id: string;
  name: string;
  quantity: number;
  sku: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
}

interface AlertsActivityTabsProps {
  criticalStockItems: Product[];
  activities: ActivityItem[];
}

export default function AlertsActivityTabs({
  criticalStockItems,
  activities,
}: AlertsActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<"alerts" | "activity">("alerts");

  /**
   * Handle swipe gesture to switch between tabs
   * Swipe left -> go to Activity (next tab)
   * Swipe right -> go to Alerts (previous tab)
   */
  const handleSwipe = useCallback((direction: SwipeDirection) => {
    setActiveTab((prevTab) => {
      if (direction === "left" && prevTab === "alerts") {
        return "activity";
      } else if (direction === "right" && prevTab === "activity") {
        return "alerts";
      }
      return prevTab;
    });
  }, []);

  const { containerRef } = useSwipeGesture({
    onSwipe: handleSwipe,
    threshold: 50,
    enabled: true,
  });

  return (
    <>
      {/* Desktop View - Side by Side */}
      <div className="hidden lg:grid grid-cols-2 gap-8">
        {/* Alerts Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Critical Stock Alerts
              </h2>
            </div>
            {criticalStockItems.length > 0 && (
              <Link
                href="/inventory?status=critical-stock"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs md:text-sm font-semibold rounded-lg transition-colors"
              >
                See All
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </div>
          {criticalStockItems.length > 0 && (
            <span className="text-xs text-gray-500 font-medium block mb-4">
              {criticalStockItems.length} item
              {criticalStockItems.length !== 1 ? "s" : ""} need attention
            </span>
          )}

          {criticalStockItems.length > 0 ? (
            <div className="space-y-3">
              {criticalStockItems.map((product) => {
                const status =
                  product.quantity === 0 ? "Out of Stock" : "Low Stock";
                const statusColor =
                  product.quantity === 0
                    ? "text-red-600 bg-red-50"
                    : "text-yellow-600 bg-yellow-50";

                return (
                  <Link
                    key={product.id}
                    href={`/inventory/${product.id}/edit-product`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        SKU: {product.sku ? product.sku : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs md:text-sm font-bold ${statusColor} px-2 py-1 rounded inline-block`}
                      >
                        {product.quantity} units
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{status}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyAlertsState />
          )}
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h2>
            </div>
            {activities.length > 0 && (
              <Link
                href="/activities"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs md:text-sm font-semibold rounded-lg transition-colors"
              >
                See All
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </div>
          {activities.length > 0 && (
            <span className="text-xs text-gray-500 font-medium">
              Latest {activities.length}
            </span>
          )}

          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xl mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatActivityTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyActivityState />
          )}
        </div>
      </div>

      {/* Mobile/Tablet View - Tabs with Swipe Support */}
      <div
        ref={containerRef}
        className="lg:hidden bg-white rounded-lg border border-gray-200 touch-pan-y"
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === "alerts"
                ? "border-b-2 border-red-600 text-red-600 bg-red-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Alerts
            {criticalStockItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {criticalStockItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === "activity"
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        {/* Tab Content with Smooth Transitions */}
        <div className="p-4 md:p-6 transition-opacity duration-300 ease-in-out">
          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Critical Stock Alerts
                </h2>
                {criticalStockItems.length > 0 && (
                  <Link
                    href="/inventory?status=critical-stock"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs md:text-sm font-semibold rounded-lg transition-colors"
                  >
                    See All
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                )}
              </div>
              {criticalStockItems.length > 0 && (
                <span className="text-xs text-gray-500 font-medium block mb-4">
                  {criticalStockItems.length} item
                  {criticalStockItems.length !== 1 ? "s" : ""} need attention
                </span>
              )}

              {criticalStockItems.length > 0 ? (
                <div className="space-y-3">
                  {criticalStockItems.map((product) => {
                    const status =
                      product.quantity === 0 ? "Out of Stock" : "Low Stock";
                    const statusColor =
                      product.quantity === 0
                        ? "text-red-600 bg-red-50"
                        : "text-yellow-600 bg-yellow-50";

                    return (
                      <Link
                        key={product.id}
                        href={`/inventory/${product.id}/edit-product`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs md:text-sm font-bold ${statusColor} px-2 py-1 rounded inline-block`}
                          >
                            {product.quantity} units
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{status}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyAlertsState />
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </h2>
                {activities.length > 0 && (
                  <Link
                    href="/activities"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs md:text-sm font-semibold rounded-lg transition-colors"
                  >
                    See All
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                )}
              </div>

              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-xl mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatActivityTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyActivityState />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
