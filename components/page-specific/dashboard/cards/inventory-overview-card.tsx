"use client";

import { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/common/card";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  XCircle,
} from "lucide-react";

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
  lowStockCount,
  lowStockPercentage,
  outOfStockCount,
  outOfStockPercentage,
  criticalStockCount,
}: InventoryOverviewCardProps) {
  const [open, setOpen] = useState(false);

  // Health is count-based: a single critical SKU can matter.
  const healthStatus =
    criticalStockCount > 0
      ? "critical"
      : lowStockCount > 0
      ? "warning"
      : "healthy";

  const statusMeta =
    healthStatus === "critical"
      ? `${criticalStockCount} item(s) need attention`
      : healthStatus === "warning"
      ? `${lowStockCount} low stock item(s)`
      : "All stock levels look healthy";

  const metrics =
    criticalStockCount > 0
      ? ([
          {
            key: "critical",
            label: "Critical",
            value: criticalStockCount,
            subtitle:
              outOfStockCount > 0
                ? `${outOfStockCount} out • ${lowStockCount} low`
                : "Needs attention",
            tone: "danger" as const,
          },
          {
            key: "inStock",
            label: "In Stock",
            value: inStockCount,
            subtitle: `${inStockPercentage}%`,
            tone: "success" as const,
          },
          {
            key: "total",
            label: "Total",
            value: totalProducts,
            subtitle: "Products",
            tone: "neutral" as const,
          },
        ] as const)
      : ([
          {
            key: "inStock",
            label: "In Stock",
            value: inStockCount,
            subtitle: `${inStockPercentage}%`,
            tone: "success" as const,
          },
          {
            key: "low",
            label: "Low Stock",
            value: lowStockCount,
            subtitle: `${lowStockPercentage}%`,
            tone: "warning" as const,
          },
          {
            key: "total",
            label: "Total",
            value: totalProducts,
            subtitle: "Products",
            tone: "neutral" as const,
          },
        ] as const);

  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5">
      {/* Header */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="inventory-overview-details"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          [
            "cursor-pointer flex items-center justify-between w-full rounded-xl",
            "px-2 py-2",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40",
          ].join(" "),
          open ? "bg-(--surface-elevated)" : "hover:bg-(--surface-elevated)/60"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "inline-flex items-center justify-center w-9 h-9 rounded-full border",
              healthStatus === "critical" &&
                "bg-(--danger)/10 text-(--danger) border-(--danger)/20",
              healthStatus === "warning" &&
                "bg-(--warning)/10 text-(--warning) border-(--warning)/20",
              healthStatus === "healthy" &&
                "bg-(--success)/10 text-(--success) border-(--success)/20"
            )}
          >
            {healthStatus === "healthy" ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            ) : healthStatus === "warning" ? (
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
              Inventory Overview
            </h3>
            <p className="text-xs text-(--text-muted)">
              {statusMeta} • {totalProducts} tracked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-semibold text-(--text-muted)">
            {open ? "Hide breakdown" : "View breakdown"}
          </span>
          <ChevronDown
            className={clsx(
              "h-5 w-5 text-(--text-secondary) transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {metrics.map((m) => (
          <Metric
            key={m.key}
            label={m.label}
            value={m.value}
            subtitle={m.subtitle}
            tone={m.tone}
          />
        ))}
      </div>

      {/* Expanded */}
      <div
        id="inventory-overview-details"
        className={clsx(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mt-5 border-t border-(--border-subtle) pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-(--text-primary)">
                Breakdown
              </div>
              <div className="text-xs text-(--text-muted)">
                Distribution by stock status
              </div>
            </div>
            <div className="text-xs font-semibold text-(--text-muted)">
              % of products
            </div>
          </div>

          <div className="space-y-4">
            <StockBar
              label="In Stock"
              value={inStockPercentage}
              tone="success"
            />
            <StockBar
              label="Low Stock"
              value={lowStockPercentage}
              tone="warning"
            />
            <StockBar
              label="Out of Stock"
              value={outOfStockPercentage}
              tone="danger"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Subcomponents ---------- */

function Metric({
  label,
  value,
  subtitle,
  tone,
}: {
  label: string;
  value: number;
  subtitle: string;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  const valueTone = {
    success: "text-(--success)",
    warning: "text-(--warning)",
    danger: "text-(--danger)",
    neutral: "text-(--text-primary)",
  };

  return (
    <div
      className={[
        "rounded-xl border border-(--border-subtle)",
        "bg-(--surface-elevated)/30",
        "px-2.5 py-2.5 sm:px-3 sm:py-3",
        "text-center",
      ].join(" ")}
    >
      <div className="text-[11px] sm:text-xs font-semibold text-(--text-muted)">
        {label}
      </div>
      <div
        className={clsx("mt-1 text-xl sm:text-2xl font-bold", valueTone[tone])}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-(--text-muted)">{subtitle}</div>
    </div>
  );
}

function StockBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const pct = Math.max(0, Math.min(100, value));

  const barTone = {
    success: "bg-(--success)",
    warning: "bg-(--warning)",
    danger: "bg-(--danger)",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-(--text-secondary)">
          {label}
        </span>
        <span className="text-sm font-semibold text-(--text-primary)">
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-(--surface-elevated)/60 overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            barTone[tone]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
