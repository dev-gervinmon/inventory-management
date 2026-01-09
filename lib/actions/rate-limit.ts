"use server";

import { headers } from "next/headers";
import { checkFixedWindow } from "@/lib/rate-limit/memory";
import { getClientIpFromHeaders } from "@/lib/rate-limit/request";
import { retryAfterSeconds } from "@/lib/rate-limit/http";

export type ActionRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export type ActionRateLimitConfig = {
  /** Prefix to isolate this action from other actions/endpoints. */
  prefix: string;
  /** Max actions per window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;

  /** If provided, rate limit per user id (recommended for authenticated actions). */
  userId?: string;
  /** Override the grouping key completely. */
  key?: string;
};

/**
 * Rate limit helper designed for Next.js Server Actions.
 *
 * Keying:
 * - If `key` is provided, uses it.
 * - Else if `userId` is provided, uses `user:<id>`.
 * - Else falls back to IP from request headers.
 *
 * Storage:
 * - Uses in-memory buckets; good for dev/single server.
 * - For serverless/multi-instance, swap to a shared store (Redis/KV).
 */
export async function checkActionRateLimit(
  config: ActionRateLimitConfig
): Promise<ActionRateLimitResult> {
  const nowMs = Date.now();

  const groupingKey =
    config.key ??
    (config.userId
      ? `user:${config.userId}`
      : `ip:${getClientIpFromHeaders(await headers())}`);

  const rl = checkFixedWindow(`${config.prefix}${groupingKey}`, {
    limit: config.limit,
    windowMs: config.windowMs,
    nowMs,
  });

  return {
    allowed: rl.allowed,
    limit: rl.limit,
    remaining: rl.remaining,
    retryAfterSeconds: retryAfterSeconds(rl.resetMs, nowMs),
  };
}
