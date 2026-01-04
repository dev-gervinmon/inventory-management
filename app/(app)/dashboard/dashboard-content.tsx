import InventoryOverviewCard from "@/components/page-specific/dashboard/cards/inventory-overview-card";
import DashboardHeader from "@/components/page-specific/dashboard/sections/dashboard-header";
import StockMovementCard from "@/components/page-specific/dashboard/cards/stock-movement-card";
import StockRiskCard from "@/components/page-specific/dashboard/cards/stock-risk-card";
import TotalValueCard from "@/components/page-specific/dashboard/cards/total-value-card";
import InventoryValueTrendCard from "@/components/page-specific/dashboard/cards/inventory-value-trend-card";
import InventoryHealthTrendCard from "@/components/page-specific/dashboard/cards/inventory-health-trend-card";
import MovementInsightsCard from "@/components/page-specific/dashboard/cards/movement-insights-card";
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
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {/* Stock Movement Chart */}
        <StockMovementCard userId={userId} />

        {/* Inventory Value Trend */}
        <InventoryValueTrendCard userId={userId} />

        {/* Stock Health Trend */}
        <InventoryHealthTrendCard userId={userId} />
      </div>

      {/** Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="lg:col-span-2 2xl:col-span-3">
          <MovementInsightsCard userId={userId} />
        </div>
      </div>
    </>
  );
}
