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
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Stock Movements</h2>
        <p className="text-gray-500">No stock movement data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900">
          Stock Movement
        </h3>
        <span className="text-xs text-gray-500">Last 30 days</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <SummaryItem
          label="In"
          value={summary.totalIn}
          color="text-green-600"
        />
        <SummaryItem
          label="Out"
          value={summary.totalOut}
          color="text-red-600"
        />
        <SummaryItem
          label="Net"
          value={summary.netChange}
          color={summary.netChange >= 0 ? "text-green-700" : "text-red-700"}
        />
      </div>

      {/* Trend */}
      <StockMovementTrendChart data={trends} />

      {/* Top products */}
      {topMovingProducts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">
            Top moving products
          </p>
          <ul className="divide-y divide-gray-100">
            {topMovingProducts.slice(0, 3).map((p) => (
              <li
                key={p.productId}
                className="flex items-center justify-between py-1 text-sm"
              >
                <span className="truncate">{p.name}</span>
                <span className="text-gray-500">{p.totalMoved}</span>
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
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
