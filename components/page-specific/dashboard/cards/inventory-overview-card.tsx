"use client";

import { useState } from "react";
import clsx from "clsx";

interface InventoryOverviewCardProps {
  totalProducts: number;
  inStockCount: number;
  inStockPercentage: number;
  lowStockCount: number;
  lowStockPercentage: number;
  outOfStockCount: number;
  outOfStockPercentage: number;
  criticalStockCount: number;
}

export default function InventoryOverviewCard({
  totalProducts,
  inStockCount,
  inStockPercentage,
  lowStockPercentage,
  outOfStockPercentage,
  criticalStockCount,
}: InventoryOverviewCardProps) {
  const [open, setOpen] = useState(false);

  const healthStatus =
    outOfStockPercentage > 0
      ? "critical"
      : lowStockPercentage > 20
      ? "warning"
      : "healthy";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-sm col-span-2 flex flex-col">
      {/* Header */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="inventory-overview-details"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center justify-between w-full rounded-xl px-2 py-2 transition-colors",
          open ? "bg-gray-100" : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "inline-flex items-center justify-center w-9 h-9 rounded-full ring-2",
              healthStatus === "critical" &&
                "bg-red-100 text-red-600 ring-red-200",
              healthStatus === "warning" &&
                "bg-yellow-100 text-yellow-600 ring-yellow-200",
              healthStatus === "healthy" &&
                "bg-green-100 text-green-600 ring-green-200"
            )}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 3v18M3 12h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Inventory Overview
            </h3>
            <p className="text-xs text-gray-500">
              {totalProducts} products tracked
            </p>
          </div>
        </div>

        <svg
          className={clsx(
            "w-5 h-5 transition-transform duration-200",
            open && "rotate-180"
          )}
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

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Metric
          label="In Stock"
          value={inStockCount}
          subtitle={`${inStockPercentage}%`}
          color="green"
        />
        <Metric
          label="Critical"
          value={criticalStockCount}
          subtitle="Needs attention"
          color="red"
        />
        <Metric
          label="Total"
          value={totalProducts}
          subtitle="Products"
          color="gray"
        />
      </div>

      {/* Expanded */}
      <div
        id="inventory-overview-details"
        className={clsx(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mt-6 border-t pt-4 space-y-4">
          <StockBar
            label="In Stock"
            value={inStockPercentage}
            color="bg-green-500"
          />
          <StockBar
            label="Low Stock"
            value={lowStockPercentage}
            color="bg-yellow-500"
          />
          <StockBar
            label="Out of Stock"
            value={outOfStockPercentage}
            color="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Metric({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: number;
  subtitle: string;
  color: "green" | "red" | "gray";
}) {
  const colors = {
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-900",
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className={clsx("text-xl sm:text-2xl font-bold", colors[color])}>
        {value}
      </span>
      <span className="text-[11px] text-gray-400">{subtitle}</span>
    </div>
  );
}

function StockBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            color
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
