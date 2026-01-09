import { NextResponse } from "next/server";
import type { NextResponse as NextResponseType } from "next/server";
import { checkFixedWindow } from "@/lib/rate-limit/memory";
import { getClientIp } from "@/lib/rate-limit/request";
import { rateLimitHeaders, retryAfterSeconds } from "@/lib/rate-limit/http";

type Handler<T = unknown, C = unknown> = (
  req: Request,
  context?: C
) => Promise<NextResponseType<T>> | NextResponseType<T>;

export type RateLimitConfig<C = unknown> = {
  /** Max requests per window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
  /**
   * Provide a custom key for grouping requests.
   * Default: IP-based key.
   */
  key?: (req: Request, context?: C) => string | Promise<string>;
  /** Prefix to avoid key collisions across endpoints. */
  prefix?: string;
  /** Override the error message. */
  message?: string;
};

export function withRateLimit<C = unknown>(
  handler: Handler<unknown, C>,
  config: RateLimitConfig<C>
) {
  return async (req: Request, context?: C) => {
    const nowMs = Date.now();
    const keyFn =
      config.key ??
      ((request: Request) => {
        const ip = getClientIp(request);
        return `ip:${ip}`;
      });

    const rawKey = await keyFn(req, context);
    const key = `${config.prefix ?? ""}${rawKey}`;

    const rl = checkFixedWindow(key, {
      limit: config.limit,
      windowMs: config.windowMs,
      nowMs,
    });

    const headers = rateLimitHeaders({
      limit: rl.limit,
      remaining: rl.remaining,
      resetMs: rl.resetMs,
    });

    if (!rl.allowed) {
      headers.set("Retry-After", String(retryAfterSeconds(rl.resetMs, nowMs)));
      return NextResponse.json(
        { error: config.message ?? "Too Many Requests" },
        { status: 429, headers }
      );
    }

    const res = await handler(req, context);

    // Attach rate-limit headers to successful responses too.
    headers.forEach((value, headerName) => {
      res.headers.set(headerName, value);
    });

    return res;
  };
}
