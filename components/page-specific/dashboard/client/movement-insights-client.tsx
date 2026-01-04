"use client";

import { useState, useTransition } from "react";
import { ListChecks } from "lucide-react";

import { Card } from "@/components/common/card";
import { AnalyticsPeriod } from "@/lib/domain/period";
import { StockMovementAnalytics } from "@/lib/domain/stock-movement";

import PeriodSelector from "../common/period-selector";

interface Props {
  initialAnalytics: StockMovementAnalytics;
  initialPeriod: AnalyticsPeriod;
}

export default function MovementInsightsClient({
  initialAnalytics,
  initialPeriod,
}: Props) {
  const [period, setPeriod] = useState(initialPeriod);
  const [analytics, setAnalytics] =
    useState<StockMovementAnalytics>(initialAnalytics);
  const [isPending, startTransition] = useTransition();

  const top = analytics.topMovingProducts ?? [];
  const nonMoving = analytics.nonMovingProducts ?? [];

  async function fetchAnalytics(next: AnalyticsPeriod) {
    const res = await fetch(`/api/analytics/stock-movement?period=${next}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch movement insights");
    return res.json() as Promise<StockMovementAnalytics>;
  }

  function handlePeriodChange(next: AnalyticsPeriod) {
    setPeriod(next);
    startTransition(async () => {
      const nextAnalytics = await fetchAnalytics(next);
      setAnalytics(nextAnalytics);
    });
  }

  const hasAny = top.length > 0 || nonMoving.length > 0;

  if (!hasAny) {
    return (
      <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex min-h-[220px] flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-(--text-primary)">
          No movement insights yet
        </p>
        <p className="mt-1 text-xs text-(--text-muted)">
          This will populate once stock movements are recorded.
        </p>
      </Card>
    );
  }

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
              <ListChecks
                className="h-5 w-5 text-(--text-secondary)"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
                Movement Insights
              </h2>
              <p className="text-xs text-(--text-muted)">
                What’s moving vs what’s stuck
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <PeriodSelector value={period} onChange={handlePeriodChange} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListBlock
            title="Top moving"
            subtitle={`Last ${String(period)} days`}
            items={top.slice(0, 5).map((p) => ({
              id: p.productId,
              name: p.name,
              value: String(p.totalMoved),
            }))}
            emptyText="No movers in this period"
            isLoading={isPending}
          />

          <ListBlock
            title="Non-moving"
            subtitle={`No movement in ${String(period)} days`}
            items={nonMoving.slice(0, 5).map((p) => ({
              id: p.productId,
              name: p.name,
              value: String(p.quantity),
            }))}
            emptyText="Everything has moved recently"
            isLoading={isPending}
          />
        </div>
      </section>
    </Card>
  );
}

function ListBlock({
  title,
  subtitle,
  items,
  emptyText,
  isLoading,
  valueLabel,
}: {
  title: string;
  subtitle: string;
  items: { id: string; name: string; value: string }[];
  emptyText: string;
  isLoading: boolean;
  valueLabel?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold text-(--text-muted)">{title}</h3>
        <span className="text-xs text-(--text-muted) whitespace-nowrap">
          {subtitle}
        </span>
      </div>

      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/10 overflow-hidden">
        {isLoading ? (
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-(--surface-elevated)/30 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-(--surface-elevated)/30 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-(--surface-elevated)/30 animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4 text-xs text-(--text-muted)">{emptyText}</div>
        ) : (
          <ul className="divide-y divide-(--border-subtle)">
            {items.map((item, idx) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-(--text-muted)">
                    #{idx + 1}
                  </span>
                  <span className="truncate text-sm font-semibold text-(--text-primary)">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-mono text-(--text-secondary)">
                  {valueLabel ? `${valueLabel} ${item.value}` : item.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
