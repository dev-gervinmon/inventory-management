"use client";

import { useState, useTransition } from "react";
import { Activity } from "lucide-react";

import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { AnalyticsPeriod } from "@/lib/domain/period";
import { InventoryHealthTrendAnalytics } from "@/lib/domain/inventory-health-trend";

import PeriodSelector from "../common/period-selector";
import TrendIndicator from "../common/trend-indicator";
import InventoryHealthTrendChart from "../charts/inventory-health-trend-chart";

interface Props {
  initialAnalytics: InventoryHealthTrendAnalytics;
  initialPeriod: AnalyticsPeriod;
}

export default function InventoryHealthTrendClient({
  initialAnalytics,
  initialPeriod,
}: Props) {
  const [period, setPeriod] = useState(initialPeriod);
  const [analytics, setAnalytics] =
    useState<InventoryHealthTrendAnalytics>(initialAnalytics);
  const [isPending, startTransition] = useTransition();

  async function fetchAnalytics(next: AnalyticsPeriod) {
    const res = await fetch(
      `/api/analytics/inventory-health-trend?period=${next}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch inventory health trend");
    return res.json() as Promise<InventoryHealthTrendAnalytics>;
  }

  function handlePeriodChange(next: AnalyticsPeriod) {
    setPeriod(next);
    startTransition(async () => {
      const nextAnalytics = await fetchAnalytics(next);
      setAnalytics(nextAnalytics);
    });
  }

  const latest = analytics.latest;
  const hasTrend = analytics.points.length >= 2;

  if (!latest || analytics.points.length === 0) {
    return <EmptyState />;
  }

  const criticalCount = latest.lowStockCount + latest.outOfStockCount;

  return (
    <Card
      asChild
      className="border-(--border-strong) bg-glass p-3 sm:p-5 flex flex-col min-w-0"
      aria-busy={isPending}
      aria-live="polite"
    >
      <section>
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--border-subtle) bg-(--surface-elevated)/40">
              <Activity
                className="h-5 w-5 text-(--text-secondary)"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
                Stock Health Trend
              </h2>
              <p className="text-xs text-(--text-muted)">
                In stock vs low/out over time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <PeriodSelector value={period} onChange={handlePeriodChange} />
            <TrendIndicator
              direction={analytics.trendIndicator.direction}
              percentage={analytics.trendIndicator.percentage}
              label={analytics.trendIndicator.label}
              size="sm"
              isLoading={isPending}
            />
          </div>
        </header>

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-(--text-muted)">
              In stock now
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
              {latest.inStockCount}
              <span className="ml-2 text-xs font-semibold text-(--text-muted)">
                ({Math.round(latest.inStockPercentage)}%)
              </span>
            </div>
          </div>

          <Badge tone={criticalCount > 0 ? "warning" : "success"}>
            {criticalCount > 0 ? `${criticalCount} critical` : "Healthy"}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <Metric label="Low" value={latest.lowStockCount} tone="warning" />
          <Metric label="Out" value={latest.outOfStockCount} tone="danger" />
          <Metric label="Total" value={latest.totalProducts} tone="neutral" />
        </div>

        <div className="mt-4 h-[220px] min-h-[220px] min-w-0">
          {isPending ? (
            <ChartSkeleton />
          ) : hasTrend ? (
            <InventoryHealthTrendChart data={analytics.points} />
          ) : (
            <NotEnoughData />
          )}
        </div>
      </section>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "warning" | "danger" | "neutral";
}) {
  const tones = {
    warning: "text-(--warning)",
    danger: "text-(--danger)",
    neutral: "text-(--text-primary)",
  } as const;

  return (
    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3 text-center">
      <div className={["text-xl font-semibold", tones[tone]].join(" ")}>
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-(--text-muted)">
        {label}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/20 animate-pulse" />
  );
}

function EmptyState() {
  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex min-h-[220px] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-(--text-primary)">
        No stock health data yet
      </p>
      <p className="mt-1 text-xs text-(--text-muted)">
        This chart starts building once daily snapshots are recorded.
      </p>
    </Card>
  );
}

function NotEnoughData() {
  return (
    <div className="h-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/10 flex flex-col items-center justify-center text-center px-6">
      <p className="text-sm font-semibold text-(--text-primary)">
        Need more snapshots
      </p>
      <p className="mt-1 text-xs text-(--text-muted)">
        Come back tomorrow to see a trend line.
      </p>
    </div>
  );
}
