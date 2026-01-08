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
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        <header className="space-y-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-(--text-primary)">
            Activity History
          </h1>
          <p className="text-xs sm:text-sm text-(--text-muted)">
            Track all changes and actions performed on products, categories, and
            subcategories
          </p>
        </header>

        {/* Main Content: Filters + Activity Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column: Filters */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24">
              <ActivityFilters
                currentEntityType={entityTypeFilter}
                currentActionType={actionTypeFilter}
              />
            </div>
          </aside>

          {/* Right Column: Activity Table */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            <ActivityTable
              activities={activities}
              currentActionType={actionTypeFilter}
              currentEntityType={entityTypeFilter}
            />
          </main>
        </div>
      </div>
    </ActivityPageWrapper>
  );
}
