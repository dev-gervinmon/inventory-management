"use client";

import { Bell, Activity as ActivityIcon, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Tabs, { TabPanel } from "@/components/common/tabs";

interface CriticalStockItems {
  id: string;
  name: string;
  quantity: number;
  sku: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
}

export default function NotificationButton({
  stockItems,
  activities,
}: {
  stockItems: CriticalStockItems[];
  activities: Activity[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function formatActivityTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return d.toLocaleDateString();
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "PRODUCT_ADDED":
        return <ActivityIcon className="w-5 h-5 text-(--success)" />;
      case "PRODUCT_EDITED":
        return <ActivityIcon className="w-5 h-5 text-(--brand)" />;
      case "PRODUCT_DELETED":
        return <ActivityIcon className="w-5 h-5 text-(--danger)" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-(--text-muted)" />;
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        className="cursor-pointer p-2 rounded-2xl bg-(--surface-elevated)/60 hover:bg-(--surface-elevated)/80 ring-1 ring-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        aria-label="Open notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="w-5 h-5 text-(--text-primary)" />
        {/* Notification dot */}
        <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </button>
      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-glass border border-(--border-subtle) rounded-xl shadow-2xl z-50 animate-fadeIn">
          <div className="p-4 border-b border-(--border-subtle) font-bold text-lg text-(--text-primary) tracking-tight">
            Notifications
          </div>
          <Tabs
            tabs={[
              {
                id: "alerts",
                label: (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                    <AlertCircle className="w-4 h-4 text-(--danger)" /> Alerts
                    {stockItems.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-(--danger)/12 text-(--danger) text-xs font-semibold rounded-full ring-1 ring-(--danger)/25">
                        {stockItems.length}
                      </span>
                    )}
                  </span>
                ),
              },
              {
                id: "activities",
                label: (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                    <ActivityIcon className="w-4 h-4 text-(--brand)" /> Activity
                    {activities.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-(--brand)/12 text-(--brand) text-xs font-semibold rounded-full ring-1 ring-(--brand)/25">
                        {activities.length}
                      </span>
                    )}
                  </span>
                ),
              },
            ]}
            defaultTabId="alerts"
          >
            <TabPanel tabId="alerts">
              <div className="p-2 sm:p-3">
                <div className="flex items-center mb-2 justify-between">
                  <span className="text-sm font-bold text-(--text-primary)">
                    Critical Alerts
                  </span>
                  {stockItems.length > 0 && (
                    <Link
                      href="/inventory?status=critical-stock"
                      className="ml-auto px-3 py-1 text-xs font-semibold rounded-md bg-linear-to-r from-red-500 to-pink-500 text-white shadow hover:from-red-600 hover:to-pink-600 transition-colors"
                    >
                      See All
                    </Link>
                  )}
                </div>
                {stockItems.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {stockItems.slice(0, 5).map((item) => (
                      <Link
                        href={`/inventory/${item.id}/edit-product`}
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-(--danger)/10 hover:bg-(--danger)/15 transition-colors"
                      >
                        <div className="text-lg shrink-0">
                          <AlertCircle className="w-5 h-5 text-(--danger)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-(--text-primary) truncate">
                            {item.quantity === 0
                              ? `Out of stock: ${item.name} (SKU: ${item.sku})`
                              : `Low stock (${item.quantity} units): ${item.name} (SKU: ${item.sku})`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-(--text-muted) text-sm">
                    No critical alerts.
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel tabId="activities">
              <div className="p-2 sm:p-3">
                <div className="flex items-center mb-2 justify-between">
                  <span className="text-sm font-bold text-(--text-primary)">
                    Recent Activity
                  </span>
                  {activities.length > 0 && (
                    <Link
                      href="/activities"
                      className="ml-auto px-3 py-1 text-xs font-semibold rounded-md bg-linear-to-r from-blue-500 to-purple-500 text-white shadow hover:from-blue-600 hover:to-purple-600 transition-colors"
                    >
                      See All
                    </Link>
                  )}
                </div>
                {activities.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activities.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-(--surface-elevated)/60 hover:bg-(--surface-elevated)/80 transition-colors"
                      >
                        <div className="text-lg shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-(--text-primary) truncate">
                            {activity.message}
                          </span>
                          <span className="block text-[11px] text-(--text-muted)">
                            {formatActivityTime(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-(--text-muted) text-sm">
                    No activity yet.
                  </div>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      )}
    </div>
  );
}
