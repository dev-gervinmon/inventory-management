import { DEFAULT_PERIOD } from "@/lib/domain/period";
import { getStockMovementAnalytics } from "@/lib/analytics/dashboard-metrics";
import StockMovementClient from "../client/stock-movement-client";

interface StockMovementCardProps {
  userId: string;
}

export default async function StockMovementCard({
  userId,
}: StockMovementCardProps) {
  const analytics = await getStockMovementAnalytics(userId, DEFAULT_PERIOD);

  return (
    <StockMovementClient
      initialAnalytics={analytics}
      initialPeriod={DEFAULT_PERIOD}
    />
  );
}
