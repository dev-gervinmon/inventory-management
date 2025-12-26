import ProductChart from "@/components/charts/products-chart";
import PageLayout from "@/components/layout/page-layout";
import AlertsActivityTabs from "@/components/layout/alerts-activity-tabs";
import AddProductButton from "@/components/buttons/add-product-button";
import QuickActionButton from "@/components/buttons/quick-action-button";
import DashboardErrorState from "@/components/states/dashboard-error-state";
import PullToRefreshWrapper from "@/components/layout/pull-to-refresh-wrapper";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import {
  calculateStockStats,
  generateWeeklyProductData,
  getCriticalStockItems,
  DASHBOARD_LIMITS,
} from "@/lib/utils/dashboard";
import { Decimal } from "@prisma/client/runtime/client";

export default async function DashboardPage() {
  interface Product {
    id: string;
    price: Decimal;
    quantity: number;
    lowStockAt: number | null;
    createdAt: Date;
    sku: string | null;
    name: string;
  }

  interface Activity {
    id: string;
    actionType: string;
    message: string;
    createdAt: Date;
  }

  let totalProducts = 0;
  let allProducts: Product[] = [];
  let activities: Activity[] = [];
  let fetchError: Error | null = null;

  try {
    const user = await getCurrentUser();
    const userId = user.id;

    const [products, allProds, acts] = await Promise.all([
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

    totalProducts = products;
    allProducts = allProds;
    activities = acts;
  } catch (error) {
    fetchError =
      error instanceof Error
        ? error
        : new Error("Failed to load dashboard data");

    // Log error for debugging
    console.error("Dashboard error:", fetchError.message, error);
  }

  // If there was a fetch error, show error state
  if (fetchError) {
    return (
      <DashboardErrorState message="We're having trouble loading your dashboard at the moment. Please try again." />
    );
  }

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

  // Serialize critical items for client component (convert Decimal to number)
  const serializedCriticalStockItems = criticalStockItems.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    sku: item.sku,
  }));

  // Serialize activities for client component
  const serializedActivities = activities.map((activity) => ({
    id: activity.id,
    type: activity.actionType, // Map actionType to type
    message: activity.message,
    createdAt: activity.createdAt,
  }));

  return (
    <PageLayout currentPath="/dashboard">
      <PullToRefreshWrapper>
        {/** Header with Quick Actions */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 mt-0.5 sm:mt-1">
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>

          {/** Quick Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <AddProductButton
              variant="simple"
              size="sm"
              className="w-full sm:w-auto justify-center sm:justify-start"
            />
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
              className="w-full sm:w-auto justify-center"
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
              className="w-full sm:w-auto justify-center"
            />
          </div>
        </div>

        {/** Key Metrics - 4 Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
          {/** Total Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm md:text-sm text-gray-700 font-semibold">
                  Total Products
                </p>
                <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {totalProducts}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 md:w-6 md:h-6 text-blue-600">📦</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 landscape:mt-2 landscape:hidden">
              All products in inventory
            </p>
          </div>

          {/** Total Value */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm md:text-sm text-gray-700 font-semibold">
                  Total Value
                </p>
                <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
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
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm md:text-sm text-gray-700 font-semibold">
                  In Stock
                </p>
                <p className="text-lg sm:text-xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
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
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm md:text-sm text-gray-700 font-semibold">
                  Critical Stock
                </p>
                <p className="text-lg sm:text-xl md:text-3xl font-bold text-red-600 mt-1 sm:mt-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-10">
          {/* Weekly Products Chart - Full width on tablet, 2 cols on desktop */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-5">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                New Products Per Week
              </h2>
            </div>
            <div
              className="w-full min-w-0 min-h-0 lg:max-h-80"
              style={{ aspectRatio: "4/1" }}
            >
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>

          {/* Stock Distribution - Visible on tablet and desktop, stacks below chart on tablet */}
          <div className="hidden md:block lg:col-span-1 bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-4 hover:shadow-sm transition-all duration-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 lg:mb-5">
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
        <AlertsActivityTabs
          criticalStockItems={serializedCriticalStockItems}
          activities={serializedActivities}
        />
      </PullToRefreshWrapper>
    </PageLayout>
  );
}
