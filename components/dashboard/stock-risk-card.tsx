import { ITEM_SEVERITY_COLOR, RISK_STYLES } from "@/lib/constants/dashboard";
import { StockRiskItem } from "@/lib/types/dashboard";
import Link from "next/link";

interface StockRiskCardProps {
  totalAtRisk: number;
  outOfStock: number;
  lowStock: number;
  items: StockRiskItem[];
}

export default function StockRiskCard({
  totalAtRisk,
  outOfStock,
  lowStock,
  items,
}: StockRiskCardProps) {
  const isHealthy = totalAtRisk === 0;

  const riskLevel: "high" | "medium" | "low" = isHealthy
    ? "low"
    : outOfStock > 0
    ? "high"
    : "medium";

  const color = RISK_STYLES[riskLevel];

  return (
    <div
      className={`bg-white rounded-lg border p-4 sm:p-5 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between ${color}`}
    >
      {/* Healthy State */}
      {isHealthy ? (
        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2 sm:px-6">
          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4">
            {/* Subtle glowing effect */}
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-15 blur-xl" />
            <span className="relative flex items-center justify-center w-full h-full rounded-full bg-green-50 border-4 border-green-100 shadow-inner">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  fill="#bbf7d0"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12.5l3 3 5-5"
                  stroke="#22c55e"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </div>
          <h4 className="text-lg sm:text-2xl font-bold text-green-700 mb-1 tracking-tight">
            All Stocks Healthy
          </h4>
          <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">
            No low or out-of-stock items detected
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Your inventory is in great shape. Keep it up!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Header with icon and badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Icon circle and icon color based on urgency */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-inner
                  ${
                    outOfStock > 0
                      ? "bg-linear-to-tr from-red-100 to-pink-100 border-red-200"
                      : lowStock > 0
                      ? "bg-linear-to-tr from-yellow-100 to-yellow-50 border-yellow-300"
                      : "bg-linear-to-tr from-green-100 to-green-50 border-green-300"
                  }
                `}
              >
                {outOfStock > 0 ? (
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      fill="#fee2e2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                  </svg>
                ) : lowStock > 0 ? (
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#eab308"
                      strokeWidth="2.5"
                      fill="#fef9c3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01"
                      stroke="#eab308"
                      strokeWidth="2.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      fill="#bbf7d0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12.5l3 3 5-5"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}
              </div>
              <h4
                className={`text-lg sm:text-xl font-bold tracking-tight
                ${
                  outOfStock > 0
                    ? "text-red-700"
                    : lowStock > 0
                    ? "text-yellow-700"
                    : "text-green-700"
                }`}
              >
                Stock Risk Overview
              </h4>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm
              ${
                outOfStock > 0
                  ? "bg-linear-to-tr from-red-100 to-pink-100 text-red-700 border-red-200"
                  : lowStock > 0
                  ? "bg-linear-to-tr from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-300"
                  : "bg-linear-to-tr from-green-100 to-green-50 text-green-700 border-green-300"
              }`}
            >
              {totalAtRisk} at risk
            </span>
          </div>

          {/* Risk Summary */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-1">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                <span className="text-red-600 text-xl">⛔</span>
                <span className="text-sm font-semibold text-red-700 truncate">
                  {outOfStock} out of stock
                </span>
              </div>
            )}
            {lowStock > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                <span className="text-yellow-500 text-xl">⚠️</span>
                <span className="text-sm font-semibold text-yellow-700 truncate">
                  {lowStock} low stock
                </span>
              </div>
            )}
          </div>

          {/* Critical Items */}
          {items.length > 0 && (
            <div className="mb-1">
              <div className="text-xs font-semibold text-gray-600 mb-1 pl-1">
                Critical items
              </div>
              <ul className="max-h-28 overflow-y-auto divide-y divide-gray-100">
                {items.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.id}/edit-product`}
                      className="flex items-center gap-2 py-2 px-2 rounded-lg group hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ITEM_SEVERITY_COLOR[item.severity]
                        }`}
                      />
                      <span className="truncate text-xs sm:text-sm text-gray-800 font-semibold underline group-hover:underline">
                        {item.name}
                      </span>
                      <span className="ml-auto text-xs sm:text-sm text-gray-500">
                        {item.quantity === 0 ? "Out" : `Low (${item.quantity})`}
                      </span>
                      <span className="ml-1 text-gray-400 group-hover:text-gray-700 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/inventory?filter=critical"
            className="mt-2 inline-block w-full px-4 py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white text-sm font-bold shadow hover:from-red-600 hover:to-pink-600 transition-colors text-center tracking-tight"
          >
            Review all critical items
          </Link>
        </div>
      )}
    </div>
  );
}
