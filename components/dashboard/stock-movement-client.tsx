"use client";

import { useState, useTransition } from "react";
import { AnalyticsPeriod } from "@/lib/domain/period";
import { StockMovementAnalytics } from "@/lib/domain/stock-movement";

import PeriodSelector from "./period-selector";
import TrendIndicator from "../common/trend-indicator";
import StockMovementTrendChart from "../charts/stock-movement-trend-chart";

interface Props {
  initialAnalytics: StockMovementAnalytics;
  initialPeriod: AnalyticsPeriod;
}

export default function StockMovementClient({
  initialAnalytics,
  initialPeriod,
}: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialPeriod);
  const [analytics, setAnalytics] =
    useState<StockMovementAnalytics>(initialAnalytics);
  const [isPending, startTransition] = useTransition();

  const { summary, trends, topMovingProducts, trendIndicator } = analytics;

  async function fetchAnalytics(period: AnalyticsPeriod) {
    const res = await fetch(`/api/analytics/stock-movement?period=${period}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch stock movement analytics");
    }

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
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
        <h3 className="font-semibold text-gray-700 mb-1">Stock Movement</h3>
        <p className="text-sm text-gray-400">
          No stock movement data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex flex-col gap-5 transition-opacity">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            ↑↓
          </span>
          <h3 className="font-semibold text-gray-900">Stock Movement</h3>
        </div>

        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={handlePeriodChange} />
          <TrendIndicator
            direction={trendIndicator.direction}
            percentage={trendIndicator.percentage}
            label="vs previous"
            size="sm"
            isLoading={isPending}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <Summary label="In" value={summary.totalIn} color="text-green-600" />
        <Summary label="Out" value={summary.totalOut} color="text-red-600" />
        <Summary
          label="Net"
          value={summary.netChange}
          color={summary.netChange >= 0 ? "text-green-700" : "text-red-700"}
        />
      </div>

      {/* Chart */}
      <div
        className={`min-h-[220px] transition-opacity ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <StockMovementTrendChart data={trends} />
      </div>

      {/* Top products */}
      {topMovingProducts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
            Top Moving Products
          </p>
          <ul className="divide-y divide-gray-100">
            {topMovingProducts.slice(0, 3).map((p, i) => (
              <li
                key={p.productId}
                className="flex justify-between py-2 text-sm"
              >
                <span className="truncate font-medium text-gray-800">
                  {i + 1}. {p.name}
                </span>
                <span className="text-xs text-gray-500">{p.totalMoved}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Summary({
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
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
