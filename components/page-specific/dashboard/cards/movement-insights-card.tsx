import { DEFAULT_PERIOD } from "@/lib/domain/period";
import { getStockMovementAnalytics } from "@/lib/analytics/dashboard-metrics";
import MovementInsightsClient from "../client/movement-insights-client";

interface MovementInsightsCardProps {
  userId: string;
}

export default async function MovementInsightsCard({
  userId,
}: MovementInsightsCardProps) {
  const analytics = await getStockMovementAnalytics(userId, DEFAULT_PERIOD);

  return (
    <MovementInsightsClient
      initialAnalytics={analytics}
      initialPeriod={DEFAULT_PERIOD}
    />
  );
}
