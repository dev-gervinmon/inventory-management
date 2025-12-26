import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { getCurrentUser } from "@/lib/auth/auth";

export const GET = withApiHandler(async () => {
  const user = await getCurrentUser();
  const userId = user.id;

  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(activities);
});
