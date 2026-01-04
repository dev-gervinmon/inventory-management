"use client";

import { useState, useTransition } from "react";
import { AnalyticsPeriod } from "@/lib/domain/period";
import {
  StockMovementAnalytics,
  StockMovementTrendIndicator,
} from "@/lib/domain/stock-movement";
import { Card } from "@/components/common/card";
import { ArrowLeftRight } from "lucide-react";

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

  const { summary, trends, trendIndicator } = analytics;

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

  const hasTrendData = trends.some((d) => d.in > 0 || d.out > 0);
  const hasData = summary.totalIn > 0 || summary.totalOut > 0 || hasTrendData;

  if (!hasData) {
    return <EmptyState />;
  }

  return (
    <Card
      asChild
      className="border-(--border-strong) bg-glass p-3 sm:p-5 flex flex-col min-w-0"
      aria-busy={isPending}
      aria-live="polite"
    >
      <section>
        <Header
          period={period}
          onPeriodChange={handlePeriodChange}
          trend={trendIndicator}
          isLoading={isPending}
        />

        <SummaryGrid summary={summary} />

        <div className="mt-4 h-[220px] min-h-[220px] min-w-0">
          {isPending ? (
            <ChartSkeleton />
          ) : (
            <StockMovementTrendChart data={trends} />
          )}
        </div>
      </section>
    </Card>
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
    <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--border-subtle) bg-(--surface-elevated)/40">
          <ArrowLeftRight
            className="h-5 w-5 text-(--text-secondary)"
            aria-hidden="true"
          />
        </span>
        <div>
          <h2 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
            Stock Movement
          </h2>
          <p className="text-xs text-(--text-muted)">
            In vs out over the selected period
          </p>
        </div>
      </div>

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
    success: "text-(--success)",
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

/* ────────────────────────────────────────────── */
/* Loading Skeletons */
/* ────────────────────────────────────────────── */

function ChartSkeleton() {
  return (
    <div className="h-[220px] rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/20 animate-pulse" />
  );
}

/* ────────────────────────────────────────────── */
/* Empty State */
/* ────────────────────────────────────────────── */

function EmptyState() {
  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex min-h-[220px] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-(--text-primary)">
        No stock movement data available
      </p>
      <p className="mt-1 text-xs text-(--text-muted)">
        Stock updates will appear here once you start adjusting inventory.
      </p>
    </Card>
  );
}
