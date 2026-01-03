"use client";

import { useState, useTransition } from "react";
import { AnalyticsPeriod } from "@/lib/domain/period";
import {
  StockMovementAnalytics,
  StockMovementTrendIndicator,
} from "@/lib/domain/stock-movement";

import TrendIndicator from "../common/trend-indicator";
import StockMovementTrendChart from "../charts/stock-movement-trend-chart";
import PeriodSelector from "../common/period-selector";

/* ────────────────────────────────────────────── */
/* Types */
/* ────────────────────────────────────────────── */

interface Props {
  initialAnalytics: StockMovementAnalytics;
  initialPeriod: AnalyticsPeriod;
}

/* ────────────────────────────────────────────── */
/* Main Component */
/* ────────────────────────────────────────────── */

export default function StockMovementClient({
  initialAnalytics,
  initialPeriod,
}: Props) {
  const [period, setPeriod] = useState(initialPeriod);
  const [analytics, setAnalytics] =
    useState<StockMovementAnalytics>(initialAnalytics);
  const [isPending, startTransition] = useTransition();

  const { summary, trends, topMovingProducts, trendIndicator } = analytics;

  async function fetchAnalytics(next: AnalyticsPeriod) {
    const res = await fetch(`/api/analytics/stock-movement?period=${next}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stock movement analytics");
    return res.json() as Promise<StockMovementAnalytics>;
  }

  function handlePeriodChange(next: AnalyticsPeriod) {
    setPeriod(next);
    startTransition(async () => {
      const nextAnalytics = await fetchAnalytics(next);
      setAnalytics(nextAnalytics);
    });
  }

  const hasData =
    summary.totalIn > 0 || summary.totalOut > 0 || topMovingProducts.length > 0;

  if (!hasData) {
    return <EmptyState />;
  }

  return (
    <section
      className="relative rounded-2xl border border-gray-200 dark:border-gray-800
                 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm"
      aria-busy={isPending}
      aria-live="polite"
    >
      <Header
        period={period}
        onPeriodChange={handlePeriodChange}
        trend={trendIndicator}
        isLoading={isPending}
      />

      <SummaryGrid summary={summary} />

      <div className="mt-4 min-h-[220px]">
        {isPending ? (
          <ChartSkeleton />
        ) : (
          <StockMovementTrendChart data={trends} />
        )}
      </div>

      {topMovingProducts.length > 0 && (
        <TopProducts products={topMovingProducts} period={period} />
      )}
    </section>
  );
}

/* ────────────────────────────────────────────── */
/* Header */
/* ────────────────────────────────────────────── */

function Header({
  period,
  onPeriodChange,
  trend,
  isLoading,
}: {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
  trend: StockMovementTrendIndicator;
  isLoading: boolean;
}) {
  return (
    <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
        Stock Movement
      </h2>

      <div className="flex items-center gap-2 flex-wrap">
        <PeriodSelector value={period} onChange={onPeriodChange} />
        <TrendIndicator
          direction={trend.direction}
          percentage={trend.percentage}
          label="vs previous"
          size="sm"
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────── */
/* Summary */
/* ────────────────────────────────────────────── */

function SummaryGrid({
  summary,
}: {
  summary: StockMovementAnalytics["summary"];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <Metric label="In" value={summary.totalIn} tone="success" />
      <Metric label="Out" value={summary.totalOut} tone="danger" />
      <Metric
        label="Net"
        value={summary.netChange}
        tone={summary.netChange >= 0 ? "neutral" : "danger"}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "neutral";
}) {
  const tones = {
    success: "text-green-600 dark:text-green-400",
    danger: "text-red-600 dark:text-red-400",
    neutral: "text-purple-700 dark:text-purple-300",
  };

  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-800
                 bg-gray-50 dark:bg-gray-800/40 p-3 text-center"
    >
      <div className={`text-xl font-semibold ${tones[tone]}`}>{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Top Products */
/* ────────────────────────────────────────────── */

function TopProducts({
  products,
  period,
}: {
  products: StockMovementAnalytics["topMovingProducts"];
  period: AnalyticsPeriod;
}) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Top Moving Products
        </h3>
        <span className="text-xs text-gray-500">
          Last {String(period)} days
        </span>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-800">
        {products.slice(0, 3).map((p, i) => (
          <li
            key={p.productId}
            className="flex items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-gray-400">#{i + 1}</span>
              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {p.name}
              </span>
            </div>

            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {p.totalMoved}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Loading Skeletons */
/* ────────────────────────────────────────────── */

function ChartSkeleton() {
  return (
    <div className="h-[220px] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
  );
}

/* ────────────────────────────────────────────── */
/* Empty State */
/* ────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center">
      <p className="text-sm font-medium text-gray-600">
        No stock movement data available
      </p>
    </div>
  );
}
