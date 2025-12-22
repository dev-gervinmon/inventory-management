import Link from "next/link";
import ProductChart from "@/components/charts/products-chart";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import AddProductButton from "@/components/buttons/add-product-button";
import QuickActionButton from "@/components/buttons/quick-action-button";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import {
  formatActivityTime,
  getActivityIcon,
  calculateStockStats,
  generateWeeklyProductData,
  getCriticalStockItems,
  DASHBOARD_LIMITS,
} from "@/lib/utils/dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, allProducts, activities] = await Promise.all([
    prisma.product.count({ where: { userId } }),

    prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        price: true,
        quantity: true,
        lowStockAt: true,
        createdAt: true,
        sku: true,
        name: true,
      },
    }),

    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: DASHBOARD_LIMITS.ACTIVITY_FEED,
    }),
  ]);

  // Calculate stock statistics
  const stockStats = calculateStockStats(allProducts);
  const {
    inStockCount,
    lowStockCount,
    outOfStockCount,
    inStockPercentage,
    lowStockPercentage,
    outOfStockPercentage,
  } = stockStats;

  // Calculate total inventory value
  const totalValue = allProducts.reduce(
    (sum: number, product: (typeof allProducts)[number]) =>
      sum + Number(product.price) * Number(product.quantity),
    0
  );

  // Generate weekly product data for chart
  const weeklyProductsData = generateWeeklyProductData(allProducts);

  // Get critical stock items
  const criticalStockItems = getCriticalStockItems(allProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar currentPath="/dashboard" />
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {/** Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>

          {/** Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <AddProductButton variant="simple" size="sm" />
            <QuickActionButton
              href="/inventory"
              label="View Inventory"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8-4"
                  />
                </svg>
              }
              variant="secondary"
            />
            <QuickActionButton
              href="/categories"
              label="Manage Categories"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"
                  />
                </svg>
              }
              variant="secondary"
            />
          </div>
        </div>

        {/** Key Metrics - 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/** Total Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Total Products
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {totalProducts}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 md:w-6 md:h-6 text-blue-600">📦</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All products in inventory
            </p>
          </div>

          {/** Total Value */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Total Value
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  ₱{Number(totalValue).toFixed(0)}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <div className="w-5 h-5 md:w-6 md:h-6 text-green-600">💰</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Estimated inventory value
            </p>
          </div>

          {/** In Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  In Stock
                </p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                  {inStockCount}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <div className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex items-center justify-center">
                  ✓
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              {inStockPercentage}% of inventory
            </p>
          </div>

          {/** Critical Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Critical Stock
                </p>
                <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
                  {outOfStockCount + lowStockCount}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-red-50 rounded-lg">
                <div className="w-6 h-6 text-red-600 flex items-center justify-center">
                  !
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Low or out of stock items
            </p>
          </div>
        </div>

        {/** Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {/** Weekly Products Chart - 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                New Products Per Week
              </h2>
            </div>
            <div className="w-full h-48 md:h-64 min-w-0 min-h-0">
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>

          {/** Stock Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
              Stock Status
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-700">
                      In Stock
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {inStockPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${inStockPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Low Stock
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {lowStockPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${lowStockPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Out of Stock
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {outOfStockPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${outOfStockPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/** Critical Items & Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/** Low Stock Alert */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Critical Stock Alerts
              </h2>
              {criticalStockItems.length > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {criticalStockItems.length} items
                </span>
              )}
            </div>

            {criticalStockItems.length > 0 ? (
              <div className="space-y-3">
                {criticalStockItems.map(
                  (product: (typeof allProducts)[number]) => {
                    const status =
                      product.quantity === 0 ? "Out of Stock" : "Low Stock";
                    const statusColor =
                      product.quantity === 0
                        ? "text-red-600 bg-red-50"
                        : "text-yellow-600 bg-yellow-50";

                    return (
                      <Link
                        key={product.id}
                        href={`/inventory/${product.id}/edit-product`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs md:text-sm font-bold ${statusColor} px-2 py-1 rounded inline-block`}
                          >
                            {product.quantity} units
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{status}</p>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  ✓ All items are well stocked!
                </p>
              </div>
            )}
          </div>

          {/** Recent Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Latest {activities.length}
              </span>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity: (typeof activities)[number]) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-xl mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatActivityTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No activity yet. Start by adding a product!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
