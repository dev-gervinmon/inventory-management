import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { getCurrentUser } from "@/lib/auth/auth";
import type { Activity } from "@/lib/types/activities";

export const GET = withApiHandler(async () => {
  const user = await getCurrentUser();
  const userId = user.id;

  const activitiesRaw = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

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

  return NextResponse.json(activities);
}, {
  rateLimit: {
    prefix: "api:activities:list:",
    limit: 120,
    windowMs: 60_000,
  },
});
