import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { withApiHandler } from "@/lib/api/handler";

export const GET = withApiHandler(
  async () => {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    return NextResponse.json({ id: user.id });
  },
  {
    rateLimit: {
      prefix: "api:debug:whoami:",
      limit: 30,
      windowMs: 60_000,
    },
  }
);
