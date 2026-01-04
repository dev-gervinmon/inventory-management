"use client";

import { useState, useTransition } from "react";
import { LineChart } from "lucide-react";

import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { AnalyticsPeriod } from "@/lib/domain/period";
import { InventoryValueTrendAnalytics } from "@/lib/domain/inventory-value-trend";
import { formatPrice } from "@/lib/utils/products";

import PeriodSelector from "../common/period-selector";
import TrendIndicator from "../common/trend-indicator";
import InventoryValueTrendChart from "../charts/inventory-value-trend-chart";

interface Props {
  initialAnalytics: InventoryValueTrendAnalytics;
  initialPeriod: AnalyticsPeriod;
}

export default function InventoryValueTrendClient({
  initialAnalytics,
  initialPeriod,
}: Props) {
  const [period, setPeriod] = useState(initialPeriod);
  const [analytics, setAnalytics] =
    useState<InventoryValueTrendAnalytics>(initialAnalytics);
  const [isPending, startTransition] = useTransition();

  async function fetchAnalytics(next: AnalyticsPeriod) {
    const res = await fetch(
      `/api/analytics/inventory-value-trend?period=${next}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch inventory value trend");
    return res.json() as Promise<InventoryValueTrendAnalytics>;
  }

  function handlePeriodChange(next: AnalyticsPeriod) {
    setPeriod(next);
    startTransition(async () => {
      const nextAnalytics = await fetchAnalytics(next);
      setAnalytics(nextAnalytics);
    });
  }

  const latest = analytics.latest;
  const hasData = analytics.points.length >= 2;

  if (!latest || analytics.points.length === 0) {
    return <EmptyState />;
  }

  const hasCostCoverage = latest.productsMissingCost === 0;

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
              <LineChart
                className="h-5 w-5 text-(--brand)"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
                Inventory Value Trend
              </h2>
              <p className="text-xs text-(--text-muted)">
                Retail vs cost value over time
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
              Current retail value
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
              {formatPrice(latest.totalRetailValue)}
            </div>
          </div>

          <Badge tone={hasCostCoverage ? "success" : "warning"}>
            {hasCostCoverage
              ? "Cost-ready"
              : `${latest.productsMissingCost} missing cost`}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3">
            <div className="text-[11px] font-semibold text-(--text-muted)">
              At cost
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-(--text-primary)">
              {formatPrice(latest.totalCostValue)}
            </div>
          </div>

          <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3">
            <div className="text-[11px] font-semibold text-(--text-muted)">
              Potential profit
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-(--text-primary)">
              {formatPrice(latest.totalPotentialProfit)}
            </div>
          </div>
        </div>

        <div className="mt-4 min-h-[220px]">
          {isPending ? (
            <ChartSkeleton />
          ) : hasData ? (
            <InventoryValueTrendChart data={analytics.points} />
          ) : (
            <NotEnoughData />
          )}
        </div>
      </section>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[220px] rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/20 animate-pulse" />
  );
}

function EmptyState() {
  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex min-h-[220px] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-(--text-primary)">
        No value trend data yet
      </p>
      <p className="mt-1 text-xs text-(--text-muted)">
        This chart starts building once daily snapshots are recorded.
      </p>
    </Card>
  );
}

function NotEnoughData() {
  return (
    <div className="h-[220px] rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/10 flex flex-col items-center justify-center text-center px-6">
      <p className="text-sm font-semibold text-(--text-primary)">
        Need more snapshots
      </p>
      <p className="mt-1 text-xs text-(--text-muted)">
        Come back tomorrow to see a trend line.
      </p>
    </div>
  );
}
