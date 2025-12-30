import { StockMovementAnalytics } from "@/lib/domain/stock-movement";
import StockMovementTrendChart from "../charts/stock-movement-trend-chart";

interface StockMovementCardProps {
  analytics: StockMovementAnalytics;
}

export default function StockMovementCard({
  analytics,
}: StockMovementCardProps) {
  const { summary, trends, topMovingProducts } = analytics;

  const hasData =
    summary.totalIn > 0 || summary.totalOut > 0 || topMovingProducts.length > 0;

  if (!hasData) {
    return (
      <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-2 mb-2">
          <svg
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            className="text-gray-300"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700">
            Stock Movements
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          No stock movement data available.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-4 sm:p-6
        flex flex-col
        gap-5
        min-w-0
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 6l-4-4-4 4M12 2v14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="font-bold text-base sm:text-lg text-gray-900">
            Stock Movement
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">Last 30 days</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <SummaryItem
          label="In"
          value={summary.totalIn}
          color="text-green-600"
          bg="bg-green-50"
        />
        <SummaryItem
          label="Out"
          value={summary.totalOut}
          color="text-red-600"
          bg="bg-red-50"
        />
        <SummaryItem
          label="Net"
          value={summary.netChange}
          color={summary.netChange >= 0 ? "text-green-700" : "text-red-700"}
          bg={summary.netChange >= 0 ? "bg-green-100" : "bg-red-100"}
        />
      </div>

      {/* Chart */}
      {/* 🔑 flex-1 allows chart to size naturally */}
      <div className="flex-1 min-h-40 sm:min-h-[220px] min-w-0">
        <StockMovementTrendChart data={trends} />
      </div>

      {/* Top products */}
      {topMovingProducts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Top Moving Products
          </p>
          <ul className="divide-y divide-gray-100">
            {topMovingProducts.slice(0, 3).map((p, i) => (
              <li
                key={p.productId}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="truncate font-medium text-gray-800">
                  {i + 1}. {p.name}
                </span>
                <span className="text-xs font-mono text-gray-500 bg-gray-50 rounded px-2 py-0.5 ml-2">
                  {p.totalMoved}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`w-7 h-7 flex items-center justify-center rounded-full ${bg}`}
      />
      <span className={`font-bold text-lg ${color}`}>{value}</span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}
