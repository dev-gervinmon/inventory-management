import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/errors/prisma";
import { serverError, jsonError } from "@/lib/errors/http";
import { withRateLimit } from "@/lib/rate-limit/with-rate-limit";
import type { RateLimitConfig } from "@/lib/rate-limit/with-rate-limit";

type Handler<T = unknown, C = unknown> = (
  req: Request,
  context?: C
) => Promise<NextResponse<T>> | NextResponse<T>;

type ApiHandlerOptions<C = unknown> = {
  rateLimit?: RateLimitConfig<C>;
};

export function withApiHandler<C = unknown>(
  handler: Handler<unknown, C>,
  options?: ApiHandlerOptions<C>
) {
  return async (req: Request, context?: C) => {
    try {
      const effectiveHandler = options?.rateLimit
        ? withRateLimit(handler, options.rateLimit)
        : handler;

      const res = await effectiveHandler(req, context as C);
      return res;
    } catch (error: unknown) {
      const prisma = handlePrismaError(error);
      if (prisma) {
        return jsonError(prisma.message, prisma.status);
      }
      return serverError();
    }
  };
}
