import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import ActivityTable from "@/components/tables/activity-table";
import ActivityFilters from "@/components/filters/activity-filters";
import type { Activity } from "@/lib/types/activities";
import ActivityPageWrapper from "./activity-page-wrapper";

/**
 * Activities Page
 * Displays a comprehensive audit log of all user actions across products, categories, and subcategories
 * Features filtering by entity type and action type, search, sorting, and pagination
 */
export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    entityType?: string;
    actionType?: string;
  }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;
  const params = await searchParams;

  // Parse filter parameters
  const entityTypeFilter = params.entityType;
  const actionTypeFilter = params.actionType;

  // Fetch all activities for the user
  const activitiesRaw = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client components
  const activities: Activity[] = activitiesRaw.map((activity) => ({
    id: activity.id,
    userId: activity.userId,
    userName: user.displayName || user.primaryEmail || "Unknown",
    entityType: activity.entityType as Activity["entityType"],
    actionType: activity.actionType as Activity["actionType"],
    entityId: activity.entityId,
    entityName: activity.entityName,
    message: activity.message,
    details: (activity.details as Record<string, unknown>) || null,
    createdAt: activity.createdAt.toISOString(),
  }));

  return (
    <ActivityPageWrapper>
      <>
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Activity History
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 mt-0.5 sm:mt-1">
              Track all changes and actions performed on products, categories,
              and subcategories
            </p>
          </div>
        </div>

        {/* Main Content: Filters + Activity Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column: Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24 md:top-8">
              <ActivityFilters
                currentEntityType={entityTypeFilter}
                currentActionType={actionTypeFilter}
              />
            </div>
          </div>

          {/* Right Column: Activity Table */}
          <div className="lg:col-span-3">
            <ActivityTable
              activities={activities}
              currentActionType={actionTypeFilter}
              currentEntityType={entityTypeFilter}
            />
          </div>
        </div>
      </>
    </ActivityPageWrapper>
  );
}
