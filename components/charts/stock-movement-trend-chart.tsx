"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { StockMovementTrend } from "@/lib/domain/stock-movement";

interface StockMovementTrendChartProps {
  data: StockMovementTrend[];
}

export default function StockMovementTrendChart({
  data,
}: StockMovementTrendChartProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        No movement data available
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 h-40 sm:h-56 md:h-64 lg:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={isMobile ? 2 : 6}
          barCategoryGap={isMobile ? 6 : 12}
          margin={{
            top: 10,
            right: isMobile ? 8 : 20,
            left: isMobile ? -8 : 0,
            bottom: 10,
          }}
        >
          {!isMobile && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
          )}

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6b7280",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            interval={isMobile ? "preserveStartEnd" : 0}
            minTickGap={isMobile ? 20 : 8}
          />

          <YAxis
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6b7280",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={isMobile ? 24 : 32}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={isMobile ? false : { fill: "rgba(34,197,94,0.06)" }}
          />

          <Bar
            dataKey="in"
            stackId="movement"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 14 : 28}
          />
          <Bar
            dataKey="out"
            stackId="movement"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 14 : 28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import { useEffect, useState } from "react";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const inValue = payload.find((p) => p.dataKey === "in")?.value ?? 0;
  const outValue = payload.find((p) => p.dataKey === "out")?.value ?? 0;
  const net = inValue - outValue;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg text-xs min-w-[140px]">
      <p className="font-semibold text-gray-900 mb-2 text-sm">
        {formatDate(label!)}
      </p>
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-green-600">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 4v16m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          In: <span className="font-bold">{inValue}</span>
        </span>
        <span className="flex items-center gap-2 text-red-600">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 20V4m0 0l6 6m-6-6L6 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Out: <span className="font-bold">{outValue}</span>
        </span>
        <span
          className={`flex items-center gap-2 font-semibold border-t pt-2 mt-2 ${
            net >= 0 ? "text-green-700" : "text-red-700"
          }`}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 12h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Net: <span>{net}</span>
        </span>
      </div>
    </div>
  );
}
