import { DEFAULT_PERIOD } from "@/lib/domain/period";
import { getInventoryHealthTrendAnalytics } from "@/lib/analytics/inventory-health-trend";
import InventoryHealthTrendClient from "../client/inventory-health-trend-client";

interface InventoryHealthTrendCardProps {
  userId: string;
}

export default async function InventoryHealthTrendCard({
  userId,
}: InventoryHealthTrendCardProps) {
  const analytics = await getInventoryHealthTrendAnalytics(
    userId,
    DEFAULT_PERIOD
  );

  return (
    <InventoryHealthTrendClient
      initialAnalytics={analytics}
      initialPeriod={DEFAULT_PERIOD}
    />
  );
}
