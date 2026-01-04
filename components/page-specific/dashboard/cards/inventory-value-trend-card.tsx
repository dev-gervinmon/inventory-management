import { DEFAULT_PERIOD } from "@/lib/domain/period";
import { getInventoryValueTrendAnalytics } from "@/lib/analytics/inventory-value-trend";
import InventoryValueTrendClient from "../client/inventory-value-trend-client";

interface InventoryValueTrendCardProps {
  userId: string;
}

export default async function InventoryValueTrendCard({
  userId,
}: InventoryValueTrendCardProps) {
  const analytics = await getInventoryValueTrendAnalytics(
    userId,
    DEFAULT_PERIOD
  );

  return (
    <InventoryValueTrendClient
      initialAnalytics={analytics}
      initialPeriod={DEFAULT_PERIOD}
    />
  );
}
