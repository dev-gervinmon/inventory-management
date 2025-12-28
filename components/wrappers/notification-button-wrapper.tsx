import {
  getCriticalStockItems,
  getRecentActivities,
} from "@/lib/actions/notifications";
import { getCurrentUser } from "@/lib/auth/auth";
import NotificationButton from "../common/notification-button";

export default async function NotificationButtonWrapper() {
  const user = await getCurrentUser();
  const userId = user.id;
  // Get critical stock items
  const criticalStockItems = await getCriticalStockItems(userId, 3);
  const activities = await getRecentActivities(userId, 3);
  // Serialize critical items for client component (convert Decimal to number)
  const serializedCriticalStockItems = criticalStockItems.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    sku: item.sku ?? "",
  }));

  // Serialize activities for client component
  const serializedActivities = activities.map((activity) => ({
    id: activity.id,
    type: activity.actionType, // Map actionType to type
    message: activity.message,
    createdAt: activity.createdAt,
  }));

  return (
    <NotificationButton
      stockItems={serializedCriticalStockItems}
      activities={serializedActivities}
    />
  );
}
