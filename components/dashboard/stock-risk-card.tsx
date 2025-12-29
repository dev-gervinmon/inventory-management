import Link from "next/link";

interface StockRiskCardProps {
  totalAtRisk: number;
  outOfStock: number;
  lowStock: number;
  items: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    lowStockAt: number;
    severity: string;
  }[];
}

export default function StockRiskCard({
  totalAtRisk,
  outOfStock,
  lowStock,
  items,
}: StockRiskCardProps) {
  const severity = outOfStock > 0 ? "high" : lowStock > 0 ? "medium" : "low";
  const color =
    severity === "high"
      ? "text-red-600 bg-red-50 border-red-200"
      : severity === "medium"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
      : "text-green-700 bg-green-50 border-green-200";

  return (
    <div
      className={`bg-white rounded-lg border p-4 sm:p-5 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between ${color}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                severity === "high"
                  ? "#dc2626"
                  : severity === "medium"
                  ? "#facc15"
                  : "#22c55e",
            }}
          />
          Stock Risk Overview
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {totalAtRisk} at risk
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-lg">⛔</span>
          <span className="text-sm font-medium text-gray-700">
            {outOfStock} out of stock
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-lg">⚠️</span>
          <span className="text-sm font-medium text-gray-700">
            {lowStock} low stock
          </span>
        </div>
      </div>

      {items && items.length > 0 && (
        <div className="mt-2 mb-3">
          <div className="text-xs font-semibold text-gray-600 mb-1">
            Critical Items
          </div>
          <ul className="max-h-24 overflow-y-auto divide-y divide-gray-100">
            {items.slice(0, 3).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/inventory/${item.id}/edit-product`}
                  className="flex items-center gap-2 py-1 px-1 rounded-md cursor-pointer group focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors"
                  tabIndex={0}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      item.severity === "high"
                        ? "bg-red-500"
                        : item.severity === "medium"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="truncate text-xs text-gray-800 font-medium underline group-hover:underline group-focus:underline">
                    {item.name}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {item.quantity === 0 ? "Out" : `Low (${item.quantity})`}
                  </span>
                  <span className="ml-2 text-gray-400 group-hover:text-gray-700 group-focus:text-gray-700 transition-colors">
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

      <Link
        href="/inventory?filter=critical"
        className="mt-3 inline-block px-4 py-2 rounded-md bg-linear-to-r from-red-500 to-pink-500 text-white text-sm font-semibold shadow hover:from-red-600 hover:to-pink-600 transition-colors text-center"
      >
        Review critical items
      </Link>
    </div>
  );
}
