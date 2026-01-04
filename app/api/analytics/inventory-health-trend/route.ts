import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { AnalyticsPeriod } from "@/lib/domain/period";
import { getInventoryHealthTrendAnalytics } from "@/lib/analytics/inventory-health-trend";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);

  const period = Number(searchParams.get("period") ?? 30) as AnalyticsPeriod;

  const analytics = await getInventoryHealthTrendAnalytics(user.id, period);

  return NextResponse.json(analytics);
}
