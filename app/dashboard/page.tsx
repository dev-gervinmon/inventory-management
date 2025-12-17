import Link from "next/link";
import ProductChart from "@/components/products-chart";
import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, allProducts] = await Promise.all([
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
  ]);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) =>
      p.lowStockAt !== null &&
      Number(p.quantity) <= Number(p.lowStockAt) &&
      Number(p.quantity) >= 1
  ).length;
  const outOfStockCount = allProducts.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      categories: true,
    },
  });

  // Get critical stock items (out of stock + low stock)
  const criticalStockItems = allProducts
    .filter((p) => p.quantity === 0 || p.quantity <= (p.lowStockAt || 5))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 8);

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
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
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
                    </div>
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
                Recent Products
              </h2>
              <Link
                href="/inventory"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {recent.map((product) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStockAt || 5)
                    ? 1
                    : 2;

                const bgColors = [
                  "bg-red-100",
                  "bg-yellow-100",
                  "bg-green-100",
                ];
                const dotColors = [
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                ];
                const textColors = [
                  "text-red-600",
                  "text-yellow-600",
                  "text-green-600",
                ];

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${dotColors[stockLevel]}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${textColors[stockLevel]}`}
                    >
                      {product.quantity} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
