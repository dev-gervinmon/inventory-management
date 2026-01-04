"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useRef } from "react";
import { StockMovementTrend } from "@/lib/domain/stock-movement";
import { CustomTooltip } from "../../../common/custom-tooltip";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { format } from "date-fns";

/* ────────────────────────────────────────────── */
/* Helpers */
/* ────────────────────────────────────────────── */

function getAnchorIndexes(length: number) {
  if (length <= 7) return Array.from({ length }, (_, i) => i);

  const anchors = new Set<number>();
  anchors.add(0);
  anchors.add(length - 1);

  const steps = length > 60 ? 4 : 3;
  for (let i = 1; i < steps; i++) {
    anchors.add(Math.round((i * (length - 1)) / steps));
  }

  return Array.from(anchors).sort((a, b) => a - b);
}

function formatAnchorLabel(date: string, length: number) {
  const d = new Date(date);

  if (length <= 10) return format(d, "EEE d");
  if (length <= 30) return format(d, "MMM d");
  if (length <= 90) return format(d, "MMM");
  return format(d, "MMM yy");
}

/* ────────────────────────────────────────────── */
/* Component */
/* ────────────────────────────────────────────── */

interface StockMovementTrendChartProps {
  data: StockMovementTrend[];
  isLoading?: boolean;
}

export default function StockMovementTrendChart({
  data,
  isLoading = false,
}: StockMovementTrendChartProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!data || data.length === 0) {
    return <EmptyChart />;
  }

  const barWidth = isMobile ? 22 : 32;
  const chartWidth = Math.max(data.length * barWidth, 100);
  const anchorIndexes = getAnchorIndexes(data.length);
  const lastDate = data[data.length - 1]?.date;

  return (
    <div className="relative w-full h-full">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/10">
        <div
          ref={scrollRef}
          className="relative h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth modern-scrollbar"
        >
          {isLoading && <ChartOverlay />}

          <div
            className="min-w-full h-full snap-x snap-mandatory"
            style={{
              width: chartWidth,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barCategoryGap={isMobile ? 8 : 14}
                margin={{
                  top: 20,
                  right: 16,
                  left: isMobile ? -8 : 0,
                  bottom: 16,
                }}
              >
                {!isMobile && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                )}

                {lastDate && (
                  <ReferenceLine
                    x={lastDate}
                    stroke="#6366f1"
                    strokeOpacity={0.12}
                  />
                )}

                <XAxis
                  dataKey="date"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                  tick={({ x, y, payload, index }) => {
                    if (!anchorIndexes.includes(index)) return null;

                    return (
                      <text
                        x={x}
                        y={y + 14}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize={isMobile ? 10 : 12}
                        fontWeight={500}
                      >
                        {formatAnchorLabel(payload.value, data.length)}
                      </text>
                    );
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 24 : 36}
                  tick={{
                    fontSize: isMobile ? 10 : 12,
                    fill: "#6b7280",
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(99, 102, 241, 0.06)",
                  }}
                  animationDuration={0}
                />

                <Bar
                  dataKey="in"
                  stackId="movement"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={barWidth}
                  className="transition-opacity duration-150 hover:opacity-90"
                />

                <Bar
                  dataKey="out"
                  stackId="movement"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={barWidth}
                  className="transition-opacity duration-150 hover:opacity-90"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .modern-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.35) transparent;
        }

        .modern-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .modern-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .modern-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.25),
            rgba(139, 92, 246, 0.35)
          );
          border-radius: 9999px;
        }

        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.45),
            rgba(139, 92, 246, 0.55)
          );
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* UI States */
/* ────────────────────────────────────────────── */

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-(--text-muted) bg-(--surface-elevated)/10 rounded-xl border border-dashed border-(--border-subtle)">
      No movement data available
    </div>
  );
}

function ChartOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-(--surface-elevated)/60 backdrop-blur-sm rounded-xl">
      <div className="h-24 w-full mx-6 rounded-lg bg-(--surface-elevated)/40 animate-pulse" />
    </div>
  );
}
