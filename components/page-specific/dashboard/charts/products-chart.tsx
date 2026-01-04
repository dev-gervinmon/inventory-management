"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

interface ChartData {
  week: string;
  products: number;
}

export default function ProductChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Area
            type="monotone"
            dataKey="products"
            stroke="var(--brand)"
            fill="var(--brand)"
            fillOpacity={0.16}
            strokeWidth={2}
            dot={{ fill: "var(--brand)", strokeWidth: 2, r: 2 }}
            activeDot={{ fill: "var(--brand)", strokeWidth: 2, r: 4 }}
          />

          <Tooltip
            content={<ProductsTooltip />}
            cursor={{ stroke: "var(--border-subtle)", strokeWidth: 1 }}
            animationDuration={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-xl border border-(--border-strong) bg-glass px-3 py-2 text-xs">
      <div className="font-semibold text-(--text-primary)">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <span className="text-(--text-muted)">Products</span>
        <span className="font-semibold text-(--text-primary)">{value}</span>
      </div>
    </div>
  );
}
