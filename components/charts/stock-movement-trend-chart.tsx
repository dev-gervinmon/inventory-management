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
import { CustomTooltip, formatDate } from "../common/custom-tooltip";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

interface StockMovementTrendChartProps {
  data: StockMovementTrend[];
}

export default function StockMovementTrendChart({
  data,
}: StockMovementTrendChartProps) {
  const isClient = typeof window !== "undefined";
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        No movement data available
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0 h-44 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={isClient && isMobile ? 2 : 6}
          barCategoryGap={isClient && isMobile ? 6 : 12}
          margin={{
            top: 10,
            right: isClient && isMobile ? 8 : 20,
            left: isClient && isMobile ? -8 : 0,
            bottom: 10,
          }}
        >
          {isClient && !isMobile && (
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
              fontSize: isClient && isMobile ? 10 : 12,
              fill: "#6b7280",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            interval={isClient && isMobile ? "preserveStartEnd" : 0}
            minTickGap={isClient && isMobile ? 20 : 8}
          />

          <YAxis
            tick={{
              fontSize: isClient && isMobile ? 10 : 12,
              fill: "#6b7280",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={isClient && isMobile ? 24 : 32}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
            animationDuration={0}
          />

          <Bar
            dataKey="in"
            stackId="movement"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={isClient && isMobile ? 14 : 28}
          />
          <Bar
            dataKey="out"
            stackId="movement"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={isClient && isMobile ? 14 : 28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
