import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardMetrics } from "@/lib/analytics/dashboard-metrics";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const dashboardMetrics = await getDashboardMetrics(user.id);

  return (
    <DashboardContent dashboardMetrics={dashboardMetrics} userId={user.id} />
  );
}
