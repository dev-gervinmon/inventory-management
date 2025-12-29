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
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                riskLevel === "high"
                  ? "#dc2626"
                  : riskLevel === "medium"
                  ? "#facc15"
                  : "#22c55e",
            }}
          />
          Stock Risk Overview
        </h3>

        {!isHealthy && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {totalAtRisk} at risk
          </span>
        )}
      </div>

      {/* Healthy State */}
      {isHealthy ? (
        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2 sm:px-6">
          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-50 border-4 border-green-100 shadow-inner mb-4">
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
        <>
          {/* Risk Summary */}
          <div className="flex flex-col gap-2 mb-3">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">⛔</span>
                <span className="text-sm font-medium text-gray-700">
                  {outOfStock} out of stock
                </span>
              </div>
            )}

            {lowStock > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">⚠️</span>
                <span className="text-sm font-medium text-gray-700">
                  {lowStock} low stock
                </span>
              </div>
            )}
          </div>

          {/* Critical Items */}
          {items.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Critical items
              </div>
              <ul className="max-h-24 overflow-y-auto divide-y divide-gray-100">
                {items.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.id}/edit-product`}
                      className="flex items-center gap-2 py-1 px-1 rounded-md group hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ITEM_SEVERITY_COLOR[item.severity]
                        }`}
                      />
                      <span className="truncate text-xs text-gray-800 font-medium underline group-hover:underline">
                        {item.name}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {item.quantity === 0 ? "Out" : `Low (${item.quantity})`}
                      </span>
                      <span className="ml-1 text-gray-400 group-hover:text-gray-700 transition-colors">
                        <svg
                          className="w-3.5 h-3.5"
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
            className="mt-3 inline-block px-4 py-2 rounded-md bg-linear-to-r from-red-500 to-pink-500 text-white text-sm font-semibold shadow hover:from-red-600 hover:to-pink-600 transition-colors text-center"
          >
            Review critical items
          </Link>
        </>
      )}
    </div>
  );
}
