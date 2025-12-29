import AddProductButton from "@/components/buttons/add-product-button";
import QuickActionButton from "@/components/buttons/quick-action-button";
import ProductChart from "@/components/charts/products-chart";
import InventoryOverviewCard from "@/components/common/inventory-overview-card";
import PageLayout from "@/components/layout/page-layout";
import PullToRefreshWrapper from "@/components/layout/pull-to-refresh-wrapper";

interface DashboardContentProps {
  dashboardMetrics: {
    inventory: {
      totalProducts: number;
      inStockCount: number;
      lowStockCount: number;
      outOfStockCount: number;
      inStockPercentage: number;
      lowStockPercentage: number;
      outOfStockPercentage: number;
    };
    risk: {
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
    };
  };
  inventoryValue: {
    totalValue: number;
  };
  weeklyProductStats: {
    week: string;
    products: number;
  }[];
}

export default function DashboardContent({
  dashboardMetrics,
  inventoryValue,
  weeklyProductStats,
}: DashboardContentProps) {
  return (
    <PageLayout>
      <PullToRefreshWrapper>
        {/** Header with Quick Actions **/}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mt-0.5 sm:mt-1">
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

        {/** Key Metrics - 4 Column Grid with Alerts/Activity as 3rd card */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
          {/* Inventory Overview Card (collapsible, client component) */}
          <div className="2xl:col-start-1 2xl:row-start-1">
            <InventoryOverviewCard
              totalProducts={dashboardMetrics.inventory.totalProducts}
              inStockCount={dashboardMetrics.inventory.inStockCount}
              inStockPercentage={dashboardMetrics.inventory.inStockPercentage}
              lowStockCount={dashboardMetrics.inventory.lowStockCount}
              lowStockPercentage={dashboardMetrics.inventory.lowStockPercentage}
              outOfStockCount={dashboardMetrics.inventory.outOfStockCount}
              outOfStockPercentage={
                dashboardMetrics.inventory.outOfStockPercentage
              }
              criticalStockCount={
                dashboardMetrics.inventory.outOfStockCount +
                dashboardMetrics.inventory.lowStockCount
              }
            />
          </div>

          {/* Total Value Card */}
          <div className="2xl:col-start-2 2xl:row-start-1">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 font-semibold">
                    Total Value
                  </p>
                  <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mt-1 sm:mt-2">
                    ₱{Number(inventoryValue.totalValue).toFixed(0)}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="w-5 h-5 md:w-6 md:h-6 text-green-600">💰</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-500 mt-4">
                Estimated inventory value
              </p>
            </div>
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
              <ProductChart data={weeklyProductStats} />
            </div>
          </div>
        </div>
      </PullToRefreshWrapper>
    </PageLayout>
  );
}
