import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { withRateLimit } from "@/lib/rate-limit/with-rate-limit";

// Export *named* handlers
const handlers = createRouteHandler({
  router: ourFileRouter,
});

export const GET = withRateLimit(
  async (req: Request) => handlers.GET(req as any),
  {
    prefix: "api:uploadthing:get:",
    limit: 120,
    windowMs: 60_000,
  }
);

export const POST = withRateLimit(
  async (req: Request) => handlers.POST(req as any),
  {
    prefix: "api:uploadthing:post:",
    limit: 20,
    windowMs: 60_000,
  }
);
