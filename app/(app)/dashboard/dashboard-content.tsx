import ProductChart from "@/components/page-specific/dashboard/charts/products-chart";
import InventoryOverviewCard from "@/components/page-specific/dashboard/cards/inventory-overview-card";
import DashboardHeader from "@/components/page-specific/dashboard/sections/dashboard-header";
import StockMovementCard from "@/components/page-specific/dashboard/cards/stock-movement-card";
import StockRiskCard from "@/components/page-specific/dashboard/cards/stock-risk-card";
import TotalValueCard from "@/components/page-specific/dashboard/cards/total-value-card";
import { DashboardMetrics } from "@/lib/domain/dashboard-metrics";

interface DashboardContentProps {
  dashboardMetrics: DashboardMetrics;
  userId: string;
  userName: string;
}

export default function DashboardContent({
  dashboardMetrics,
  userId,
  userName,
}: DashboardContentProps) {
  return (
    <>
      <DashboardHeader
        userName={userName}
        totalProducts={dashboardMetrics.inventory.totalProducts}
        criticalCount={
          dashboardMetrics.inventory.outOfStockCount +
          dashboardMetrics.inventory.lowStockCount
        }
        reportStatus="ready"
      />

      {/** Key Metrics - Responsive Grid: 1 col (mobile), 2 col (md), 3 col (lg+) **/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
        {/* Inventory Overview Card */}
        <div className="h-full">
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
            criticalStockCount={dashboardMetrics.inventory.outOfStockCount}
          />
        </div>

        {/* Stock Risk Card */}
        <div className="h-full">
          <StockRiskCard
            totalAtRisk={dashboardMetrics.risk.totalAtRisk}
            outOfStock={dashboardMetrics.risk.outOfStock}
            lowStock={dashboardMetrics.risk.lowStock}
            items={dashboardMetrics.risk.items}
          />
        </div>

        {/* Total Value Card */}
        <div className="h-full">
          <TotalValueCard
            totalRetailValue={dashboardMetrics.value.totalRetailValue}
            totalCostValue={dashboardMetrics.value.totalCostValue}
            totalPotentialProfit={dashboardMetrics.value.totalPotentialProfit}
            productsMissingCost={dashboardMetrics.value.productsMissingCost}
          />
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
