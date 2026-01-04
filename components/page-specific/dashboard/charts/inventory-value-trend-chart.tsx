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

import { InventoryValueTrendPoint } from "@/lib/domain/inventory-value-trend";
import { formatPrice } from "@/lib/utils/products";

export default function InventoryValueTrendChart({
  data,
}: {
  data: InventoryValueTrendPoint[];
}) {
  return (
    <div className="h-full w-full">
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
            tickFormatter={(v) => {
              if (typeof v !== "number") return String(v);
              if (Math.abs(v) >= 1_000_000)
                return `${Math.round(v / 1_000_000)}M`;
              if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}K`;
              return String(Math.round(v));
            }}
          />

          <Area
            type="monotone"
            dataKey="totalRetailValue"
            name="Retail"
            stroke="var(--brand)"
            fill="var(--brand)"
            fillOpacity={0.14}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--brand)", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="totalCostValue"
            name="Cost"
            stroke="var(--text-secondary)"
            fill="var(--text-secondary)"
            fillOpacity={0.06}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "var(--text-secondary)", strokeWidth: 2 }}
          />

          <Tooltip
            content={<ValueTooltip />}
            cursor={{ stroke: "var(--border-subtle)", strokeWidth: 1 }}
            animationDuration={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ValueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const retail =
    payload.find((p) => p.dataKey === "totalRetailValue")?.value ?? 0;
  const cost = payload.find((p) => p.dataKey === "totalCostValue")?.value ?? 0;

  return (
    <div className="rounded-xl border border-(--border-strong) bg-glass px-3 py-2 text-xs">
      <div className="font-semibold text-(--text-primary)">{label}</div>
      <div className="mt-2 grid gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-(--text-muted)">Retail</span>
          <span className="font-semibold text-(--text-primary)">
            {formatPrice(Number(retail))}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-(--text-muted)">Cost</span>
          <span className="font-semibold text-(--text-primary)">
            {formatPrice(Number(cost))}
          </span>
        </div>
      </div>
    </div>
  );
}
