"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/common/badge";
import { Building2, CalendarRange, Cloud, FileText } from "lucide-react";

type ReportRange = "daily" | "monthly" | "yearly";

type ReportStatus = "ready" | "generating" | "stale";

type WarehouseStatus = "live" | "syncing" | "offline";

export type DashboardWarehouse = {
  id: string;
  name: string;
  status?: WarehouseStatus;
};

interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  totalProducts?: number;
  criticalCount?: number;
  warehouses?: DashboardWarehouse[];
  defaultWarehouseId?: string;
  reportStatus?: ReportStatus;
}

function formatRangeLabel(range: ReportRange, now: Date) {
  if (range === "daily") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
    }).format(now);
  }

  if (range === "monthly") {
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(now);
  }

  return new Intl.DateTimeFormat(undefined, { year: "numeric" }).format(now);
}

function getStatusTone(status: WarehouseStatus) {
  if (status === "live") return "success" as const;
  if (status === "syncing") return "warning" as const;
  return "danger" as const;
}

function getStatusLabel(status: WarehouseStatus) {
  if (status === "live") return "Live";
  if (status === "syncing") return "Syncing";
  return "Offline";
}

function getReportTone(status: ReportStatus) {
  if (status === "ready") return "success" as const;
  if (status === "generating") return "neutral" as const;
  return "warning" as const;
}

function getReportLabel(status: ReportStatus) {
  if (status === "ready") return "Reports: Ready";
  if (status === "generating") return "Reports: Generating";
  return "Reports: Outdated";
}

function getGreeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function SegmentedRangeControl({
  value,
  onChange,
}: {
  value: ReportRange;
  onChange: (next: ReportRange) => void;
}) {
  const options: Array<{ value: ReportRange; label: string }> = [
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Select report range"
      className={[
        "inline-flex items-center gap-1 rounded-xl border p-1",
        "border-(--border-subtle)",
        "bg-(--surface-elevated)/30",
      ].join(" ")}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={[
              "px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40",
              isActive
                ? "bg-(--surface) text-(--text-primary) shadow-sm"
                : "text-(--text-secondary) hover:bg-(--surface-elevated)",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function DashboardHeader({
  title = "Dashboard",
  userName,
  totalProducts,
  criticalCount,
  warehouses,
  defaultWarehouseId,
  reportStatus = "ready",
}: DashboardHeaderProps) {
  const now = useMemo(() => new Date(), []);
  const greeting = getGreeting(now);

  const fallbackWarehouses: DashboardWarehouse[] = useMemo(
    () => [
      { id: "wh-main", name: "Main Warehouse", status: "live" },
      { id: "wh-east", name: "East Hub", status: "syncing" },
      { id: "wh-retail", name: "Retail Backroom", status: "live" },
    ],
    []
  );

  const warehouseList = warehouses?.length ? warehouses : fallbackWarehouses;

  const [warehouseId, setWarehouseId] = useState(
    defaultWarehouseId ?? warehouseList[0]?.id ?? ""
  );
  const [range, setRange] = useState<ReportRange>("monthly");

  const activeWarehouse =
    warehouseList.find((w) => w.id === warehouseId) ?? warehouseList[0];

  const rangeLabel = formatRangeLabel(range, now);
  const warehouseStatus: WarehouseStatus = activeWarehouse?.status ?? "live";

  const critical = Number(criticalCount ?? 0);
  const criticalTone =
    critical > 0 ? ("danger" as const) : ("success" as const);
  const criticalLabel =
    critical > 0 ? `Critical: ${critical}` : "Stock: Healthy";

  const productsLabel =
    typeof totalProducts === "number" ? `${totalProducts} products` : undefined;

  return (
    <div className="mb-4 sm:mb-8">
      <div className="rounded-2xl border border-(--border-strong) bg-glass p-3 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: title + context */}
          <div className="min-w-0">
            <div className="flex flex-col gap-1">
              <p className="text-xs sm:text-sm font-semibold text-(--text-muted)">
                {greeting}
                {userName ? "," : ""}{" "}
                {userName ? (
                  <span className="text-(--text-secondary)">{userName}</span>
                ) : null}
              </p>

              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-(--text-primary)">
                  {title}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
                Monitor stock health, reporting, and performance across
                warehouses.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {activeWarehouse?.name ?? "Warehouse"}
                </span>
              </Badge>

              <Badge tone="neutral">
                <span className="inline-flex items-center gap-1">
                  <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
                  {rangeLabel}
                </span>
              </Badge>

              {productsLabel && <Badge tone="neutral">{productsLabel}</Badge>}

              <Badge tone={criticalTone}>{criticalLabel}</Badge>

              <Badge tone={getStatusTone(warehouseStatus)}>
                <span className="inline-flex items-center gap-1">
                  <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
                  Sync: {getStatusLabel(warehouseStatus)}
                </span>
              </Badge>

              <Badge
                tone={getReportTone(reportStatus)}
                className="hidden sm:inline-flex"
              >
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  {getReportLabel(reportStatus)}
                </span>
              </Badge>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
            <label className="sr-only" htmlFor="dashboard-warehouse">
              Select warehouse
            </label>
            <select
              id="dashboard-warehouse"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className={[
                "h-11 w-full sm:w-[220px]",
                "rounded-xl border",
                "border-(--border-subtle)",
                "bg-glass",
                "px-3 text-sm font-semibold",
                "text-(--text-primary)",
                "outline-none",
                "focus-visible:ring-2 focus-visible:ring-(--brand)/40",
              ].join(" ")}
            >
              {warehouseList.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <SegmentedRangeControl value={range} onChange={setRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
