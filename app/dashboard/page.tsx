import Link from "next/link";
import ProductChart from "@/components/products-chart";
import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
  const { inStockCount, lowStockCount, outOfStockCount, inStockPercentage, lowStockPercentage, outOfStockPercentage } = stockStats;

  // Calculate total inventory value
  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  // Generate weekly product data for chart
  const weeklyProductsData = generateWeeklyProductData(allProducts);

  // Get critical stock items
  const criticalStockItems = getCriticalStockItems(allProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/** Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>

          {/** Quick Actions */}
          <div className="flex gap-3">
            <Link
              href="/add-product"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              + Add Product
            </Link>
            <Link
              href="/inventory"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Inventory
            </Link>
            <Link
              href="/categories"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Manage Categories
            </Link>
          </div>
        </div>

        {/** Key Metrics - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/** Total Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProducts}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 text-blue-600">📦</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All products in inventory
            </p>
          </div>

          {/** Total Value */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₱{Number(totalValue).toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 text-green-600">💰</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Estimated inventory value
            </p>
          </div>

          {/** In Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Stock</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {inStockCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 text-green-600 flex items-center justify-center">
                  ✓
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              {inStockPercentage}% of inventory
            </p>
          </div>

          {/** Critical Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Critical Stock
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {outOfStockCount + lowStockCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/** Weekly Products Chart - 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                New Products Per Week
              </h2>
            </div>
            <div className="h-64">
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>

          {/** Stock Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/** Low Stock Alert */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
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
                {criticalStockItems.map((product) => {
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
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${statusColor} px-2 py-1 rounded`}
                        >
                          {product.quantity} units
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{status}</p>
                      </div>
                    </Link>
                  );
                })}
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Latest {activities.length}
              </span>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
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
