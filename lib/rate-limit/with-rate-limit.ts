import { NextResponse } from "next/server";
import type { NextResponse as NextResponseType } from "next/server";
import { checkFixedWindow } from "@/lib/rate-limit/memory";
import { getClientIp } from "@/lib/rate-limit/request";
import { rateLimitHeaders, retryAfterSeconds } from "@/lib/rate-limit/http";
import {
  hasSharedRateLimitStore,
  getFixedWindowLimiter,
} from "@/lib/rate-limit/upstash";

type HandlerNoContext = (
  req: Request
) => Promise<NextResponseType<unknown>> | NextResponseType<unknown>;

type HandlerWithContext<C = unknown> = (
  req: Request,
  context: C
) => Promise<NextResponseType<unknown>> | NextResponseType<unknown>;

type EmptyRouteContext = { params: Promise<Record<string, never>> };

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

export function withRateLimit(
  handler: HandlerNoContext,
  config: RateLimitConfig<EmptyRouteContext>
): (
  req: Request,
  context: EmptyRouteContext
) => Promise<NextResponseType<unknown>>;

export function withRateLimit<C = unknown>(
  handler: HandlerWithContext<C>,
  config: RateLimitConfig<C>
): (req: Request, context: C) => Promise<NextResponseType<unknown>>;

export function withRateLimit<C = unknown>(
  handler: HandlerNoContext | HandlerWithContext<C>,
  config: RateLimitConfig<C>
) {
  return async (req: Request, context: C) => {
    const nowMs = Date.now();
    const keyFn =
      config.key ??
      ((request: Request) => {
        const ip = getClientIp(request);
        return `ip:${ip}`;
      });

    const rawKey = await keyFn(req, context);
    const key = `${config.prefix ?? ""}${rawKey}`;

    const rl = await (async () => {
      if (!hasSharedRateLimitStore()) {
        return checkFixedWindow(key, {
          limit: config.limit,
          windowMs: config.windowMs,
          nowMs,
        });
      }

      const limiter = getFixedWindowLimiter({
        limit: config.limit,
        windowMs: config.windowMs,
      });

      const result = await limiter.limit(key);

      const resetMs = (() => {
        const reset = (result as unknown as { reset?: unknown }).reset;

        if (reset instanceof Date) return reset.getTime();
        if (typeof reset === "number") {
          // Heuristic: treat small numbers as seconds-since-epoch.
          return reset < 1_000_000_000_000 ? reset * 1000 : reset;
        }
        if (typeof reset === "string") {
          const parsed = Date.parse(reset);
          if (!Number.isNaN(parsed)) return parsed;
        }

        return nowMs + config.windowMs;
      })();

      return {
        allowed: result.success,
        limit: result.limit,
        remaining: Math.max(0, result.remaining),
        resetMs,
      };
    })();

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

    const res = await (handler as HandlerWithContext<C>)(req, context);

    // Attach rate-limit headers to successful responses too.
    headers.forEach((value, headerName) => {
      res.headers.set(headerName, value);
    });

    return res;
  };
}
