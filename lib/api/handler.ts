import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/errors/prisma";
import { serverError, jsonError } from "@/lib/errors/http";
import { withRateLimit } from "@/lib/rate-limit/with-rate-limit";
import type { RateLimitConfig } from "@/lib/rate-limit/with-rate-limit";

type HandlerNoContext = (req: Request) => Promise<Response> | Response;

type HandlerWithContext<C = unknown> = (
  req: Request,
  context: C
) => Promise<Response> | Response;

type ApiHandlerOptions<C = unknown> = {
  rateLimit?: RateLimitConfig<C>;
};

type EmptyRouteContext = { params: Promise<{}> };

export function withApiHandler(
  handler: HandlerNoContext,
  options?: ApiHandlerOptions<EmptyRouteContext>
): (req: Request, context: EmptyRouteContext) => Promise<Response>;

export function withApiHandler<C = unknown>(
  handler: HandlerWithContext<C>,
  options?: ApiHandlerOptions<C>
): (req: Request, context: C) => Promise<Response>;

export function withApiHandler<C = unknown>(
  handler: HandlerNoContext | HandlerWithContext<C>,
  options?: ApiHandlerOptions<C>
) {
  return async (req: Request, context: C) => {
    try {
      const effectiveHandler = options?.rateLimit
        ? withRateLimit(handler as HandlerWithContext<C>, options.rateLimit)
        : handler;

      const res = await (effectiveHandler as any)(req, context);
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
