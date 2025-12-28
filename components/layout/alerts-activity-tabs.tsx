"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Activity } from "lucide-react";
import Tabs, { TabPanel } from "@/components/common/tabs";
import {
  EmptyAlertsState,
  EmptyActivityState,
} from "@/components/empty-states/dashboard-empty-states";

interface Product {
  id: string;
  name: string;
  quantity: number;
  sku?: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: string | Date;
}

interface AlertsActivityTabsProps {
  criticalStockItems: Product[];
  activities: ActivityItem[];
}

function formatActivityTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return d.toLocaleDateString();
}

function getActivityIcon(type: string) {
  // You can expand this mapping as needed
  switch (type) {
    case "add":
      return <Activity className="w-5 h-5 text-green-600" />;
    case "edit":
      return <Activity className="w-5 h-5 text-blue-600" />;
    case "delete":
      return <Activity className="w-5 h-5 text-red-600" />;
    default:
      return <Activity className="w-5 h-5 text-gray-400" />;
  }
}

export default function AlertsActivityTabs({
  criticalStockItems,
  activities,
}: AlertsActivityTabsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("alerts");
  const tabs: { id: string; label: React.ReactNode }[] = [
    {
      id: "alerts",
      label: (
        <span className="flex items-center gap-1">
          <AlertCircle className="w-4 h-4 text-red-600" />
          Alerts
          {criticalStockItems.length > 0
            ? ` (${criticalStockItems.length})`
            : ""}
        </span>
      ),
    },
    {
      id: "activity",
      label: (
        <span className="flex items-center gap-1">
          <Activity className="w-4 h-4 text-blue-600" />
          Activity{activities.length > 0 ? ` (${activities.length})` : ""}
        </span>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-lg border border-gray-200 max-w-lg mx-auto w-full">
      <button
        className={`w-full flex items-center justify-between px-4 py-2 focus:outline-none transition-colors duration-150 rounded-t-lg ${
          open ? "bg-gray-50" : "bg-white hover:bg-gray-50"
        } cursor-pointer`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="alerts-activity-tabs-content"
        type="button"
      >
        <span className="text-base sm:text-lg font-semibold text-gray-900">
          Alerts & Activities
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {/* Collapsed summary view */}
      {!open && (
        <div className="flex flex-col gap-2 px-4 py-3 border-t border-gray-100">
          <div className="flex gap-2">
            <div
              className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => {
                setActiveTab("alerts");
                setOpen(true);
              }}
              aria-label="Show Alerts"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTab("alerts");
                  setOpen(true);
                }
              }}
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-red-600">
                <AlertCircle className="w-4 h-4" /> Alerts
                {criticalStockItems.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    {criticalStockItems.length}
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {criticalStockItems.length} item
                {criticalStockItems.length !== 1 ? "s" : ""} need attention
              </span>
              <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to expand
              </span>
            </div>
            <div
              className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => {
                setActiveTab("activity");
                setOpen(true);
              }}
              aria-label="Show Activity"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTab("activity");
                  setOpen(true);
                }
              }}
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                <Activity className="w-4 h-4" /> Activity
              </span>
              <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to expand
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Expanded full tabbed view */}
      <div
        id="alerts-activity-tabs-content"
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          <TabPanel tabId="alerts">
            <div className="p-2 sm:p-3 md:p-4">
              <div className="flex items-center mb-2 justify-between">
                <h2 className="text-sm md:text-base font-semibold text-gray-900">
                  Critical Stock Alerts
                </h2>
                {criticalStockItems.length > 0 && (
                  <Link
                    href="/inventory?filter=critical"
                    className="ml-auto px-3 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    See All
                  </Link>
                )}
              </div>
              {criticalStockItems.length > 0 && (
                <span className="text-xs text-gray-500 font-medium block mb-2 text-left">
                  Items need attention
                </span>
              )}

              {criticalStockItems.length > 0 ? (
                <div className="space-y-1">
                  {criticalStockItems.slice(0, 5).map((product) => {
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
                        className="flex items-center justify-between gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-gray-900 truncate">
                            {product.name}
                          </span>
                          <span className="block text-[11px] text-gray-500">
                            SKU: {product.sku ? product.sku : "N/A"}
                          </span>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end">
                          <span
                            className={`text-xs font-bold ${statusColor} px-2 py-0.5 rounded`}
                          >
                            {product.quantity} units
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyAlertsState />
              )}
            </div>
          </TabPanel>
          <TabPanel tabId="activity">
            <div className="p-2 sm:p-3 md:p-4">
              <div className="flex items-center mb-2 justify-between">
                <h2 className="text-sm md:text-base font-semibold text-gray-900">
                  Recent Activity
                </h2>
                {activities.length > 0 && (
                  <Link
                    href="/activities"
                    className="ml-auto px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    See All
                  </Link>
                )}
              </div>
              {activities.length > 0 ? (
                <div className="space-y-1">
                  {activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-lg shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-medium text-gray-900 truncate">
                          {activity.message}
                        </span>
                        <span className="block text-[11px] text-gray-500">
                          {formatActivityTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyActivityState />
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
