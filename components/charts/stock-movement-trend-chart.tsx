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
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-500">
        No movement data available
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />

          <Bar
            dataKey="in"
            stackId="movement"
            fill="#22c55e" // green-500
            radius={[4, 4, 0, 0]}
            name="Stock In"
          />

          <Bar
            dataKey="out"
            stackId="movement"
            fill="#ef4444" // red-500
            radius={[4, 4, 0, 0]}
            name="Stock Out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

import type { Payload } from "recharts/types/component/DefaultTooltipContent";

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

  return (
    <div className="bg-white border rounded-md px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-gray-900 mb-1">{formatDate(label!)}</p>

      <div className="flex flex-col gap-0.5">
        <span className="text-green-600">In: {inValue}</span>
        <span className="text-red-600">Out: {outValue}</span>
        <span className="text-gray-700 font-semibold border-t pt-1 mt-1">
          Net: {inValue - outValue}
        </span>
      </div>
    </div>
  );
}
