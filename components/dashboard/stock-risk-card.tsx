import { ITEM_SEVERITY_COLOR, RISK_STYLES } from "@/lib/constants/dashboard";
import { StockRiskItem } from "@/lib/types/dashboard";
import Link from "next/link";
import clsx from "clsx";

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

  const containerColor = RISK_STYLES[riskLevel];

  const ctaStyles =
    outOfStock > 0
      ? "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
      : lowStock > 0
      ? "from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
      : "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";

  return (
    <div
      className={clsx(
        "bg-white rounded-xl border p-4 sm:p-5 md:p-6 transition-all duration-200 flex flex-col",
        "hover:shadow-sm hover:border-gray-300",
        containerColor
      )}
    >
      {/* ================= Healthy State ================= */}
      {isHealthy ? (
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
          <div className="relative mb-3">
            <span className="absolute inset-0 rounded-full bg-green-400/20 blur-lg" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h4 className="text-lg sm:text-xl font-semibold text-green-700">
            Inventory Healthy
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            No low or out-of-stock items detected
          </p>
        </div>
      ) : (
        <>
          {/* ================= Header ================= */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "flex items-center justify-center w-9 h-9 rounded-full border",
                  outOfStock > 0
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-yellow-50 border-yellow-200 text-yellow-600"
                )}
              >
                {outOfStock > 0 ? "⛔" : "⚠️"}
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Stock Risk Overview
                </h4>
                <p className="text-xs text-gray-500">
                  Items requiring attention
                </p>
              </div>
            </div>

            <span
              className={clsx(
                "text-xs font-semibold px-2.5 py-1 rounded-full border",
                outOfStock > 0
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              )}
            >
              {totalAtRisk} at risk
            </span>
          </div>

          {/* ================= Summary ================= */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-1">
                <span className="text-red-600">⛔</span>
                <span className="text-sm font-medium text-red-700">
                  {outOfStock} out of stock
                </span>
              </div>
            )}
            {lowStock > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex-1">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-sm font-medium text-yellow-700">
                  {lowStock} low stock
                </span>
              </div>
            )}
          </div>

          {/* ================= Critical Items ================= */}
          {items.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">
                Critical items
              </div>
              <ul className="max-h-28 overflow-y-auto divide-y divide-gray-100 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {items.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.id}/edit-product`}
                      className="flex items-center gap-2 py-2 px-2 rounded-lg transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                      <span
                        className={clsx(
                          "w-2.5 h-2.5 rounded-full shrink-0",
                          ITEM_SEVERITY_COLOR[item.severity]
                        )}
                      />
                      <span className="truncate text-sm font-medium text-gray-800">
                        {item.name}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {item.quantity === 0 ? "Out" : `Low (${item.quantity})`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ================= CTA ================= */}
          <Link
            href="/inventory?filter=critical"
            className={clsx(
              "mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded-lg",
              "bg-linear-to-r text-white text-sm font-semibold shadow-sm transition-colors",
              ctaStyles
            )}
          >
            Review critical items
          </Link>
        </>
      )}
    </div>
  );
}
