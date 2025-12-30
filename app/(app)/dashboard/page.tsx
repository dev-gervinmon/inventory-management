import { getCurrentUser } from "@/lib/auth/auth";
import {
  getDashboardMetrics,
  getStockMovementAnalytics,
} from "@/lib/analytics/dashboard-metrics";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const dashboardMetrics = await getDashboardMetrics(userId);
  const analyticsMetrics = await getStockMovementAnalytics(userId);

  return (
    <DashboardContent
      dashboardMetrics={dashboardMetrics}
      analyticsMetrics={analyticsMetrics}
    />
  );
}
