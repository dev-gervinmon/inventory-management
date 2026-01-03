import AddProductButton from "@/components/buttons/add-product-button";
import QuickActionButton from "@/components/buttons/quick-action-button";
import ProductChart from "@/components/charts/products-chart";
import InventoryOverviewCard from "@/components/common/inventory-overview-card";
import StockMovementCard from "@/components/dashboard/stock-movement-card";
import StockRiskCard from "@/components/dashboard/stock-risk-card";
import { DashboardMetrics } from "@/lib/domain/dashboard-metrics";

interface DashboardContentProps {
  dashboardMetrics: DashboardMetrics;
  userId: string;
}

export default function DashboardContent({
  dashboardMetrics,
  userId,
}: DashboardContentProps) {
  return (
    <>
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

      {/** Key Metrics - Responsive Grid: 1 col (mobile), 2 col (md), 3 col (lg+) **/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
        {/* Inventory Overview Card */}
        <div>
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

        {/* Stock Risk Card */}
        <div>
          <StockRiskCard
            totalAtRisk={dashboardMetrics.risk.totalAtRisk}
            outOfStock={dashboardMetrics.risk.outOfStock}
            lowStock={dashboardMetrics.risk.lowStock}
            items={dashboardMetrics.risk.items}
          />
        </div>

        {/* Total Value Card */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 font-semibold">
                  Total Value
                </p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mt-1 sm:mt-2">
                  ₱{Number(dashboardMetrics.value.totalValue).toFixed(0)}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {/* Weekly Products Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all duration-200 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              New Products Per Week
            </h2>
          </div>

          {/* Chart container */}
          <div className="flex-1 min-h-[180px] sm:min-h-[220px] min-w-0">
            <ProductChart data={dashboardMetrics.weeklyProductStats} />
          </div>
        </div>

        {/* Stock Movement Chart */}
        <StockMovementCard userId={userId} />
      </div>
    </>
  );
}
