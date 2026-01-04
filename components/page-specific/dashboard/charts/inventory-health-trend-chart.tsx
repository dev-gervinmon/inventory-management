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

import { InventoryHealthTrendPoint } from "@/lib/domain/inventory-health-trend";

export default function InventoryHealthTrendChart({
  data,
}: {
  data: InventoryHealthTrendPoint[];
}) {
  return (
    <div className="h-full w-full min-w-0">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            minTickGap={18}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Area
            type="monotone"
            dataKey="inStockCount"
            name="In stock"
            stroke="var(--success)"
            fill="var(--success)"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "var(--success)", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="lowStockCount"
            name="Low"
            stroke="var(--warning)"
            fill="var(--warning)"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "var(--warning)", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="outOfStockCount"
            name="Out"
            stroke="var(--danger)"
            fill="var(--danger)"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "var(--danger)", strokeWidth: 2 }}
          />

          <Tooltip
            content={<HealthTooltip />}
            cursor={{ stroke: "var(--border-subtle)", strokeWidth: 1 }}
            animationDuration={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function HealthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const inStock = payload.find((p) => p.dataKey === "inStockCount")?.value ?? 0;
  const low = payload.find((p) => p.dataKey === "lowStockCount")?.value ?? 0;
  const out = payload.find((p) => p.dataKey === "outOfStockCount")?.value ?? 0;

  return (
    <div className="rounded-xl border border-(--border-strong) bg-glass px-3 py-2 text-xs">
      <div className="font-semibold text-(--text-primary)">{label}</div>
      <div className="mt-2 grid gap-1">
        <Row label="In stock" value={Number(inStock)} tone="success" />
        <Row label="Low" value={Number(low)} tone="warning" />
        <Row label="Out" value={Number(out)} tone="danger" />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const tones = {
    success: "text-(--success)",
    warning: "text-(--warning)",
    danger: "text-(--danger)",
  } as const;

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-(--text-muted)">{label}</span>
      <span className={["font-semibold", tones[tone]].join(" ")}>{value}</span>
    </div>
  );
}
