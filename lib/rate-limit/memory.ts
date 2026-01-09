export type FixedWindowState = {
  windowStartMs: number;
  count: number;
};

export type FixedWindowResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
};

const buckets = new Map<string, FixedWindowState>();

/**
 * In-memory fixed-window rate limiter.
 *
 * Notes:
 * - Works reliably only for a single running instance (dev, single server).
 * - In serverless/multi-instance deployments you should use a shared store (e.g. Redis).
 */
export function checkFixedWindow(
  key: string,
  opts: { limit: number; windowMs: number; nowMs?: number }
): FixedWindowResult {
  const nowMs = opts.nowMs ?? Date.now();
  const windowMs = Math.max(1, opts.windowMs);
  const limit = Math.max(1, opts.limit);

  const windowStartMs = Math.floor(nowMs / windowMs) * windowMs;
  const resetMs = windowStartMs + windowMs;

  const existing = buckets.get(key);
  const state: FixedWindowState =
    existing && existing.windowStartMs === windowStartMs
      ? existing
      : { windowStartMs, count: 0 };

  state.count += 1;
  buckets.set(key, state);

  const allowed = state.count <= limit;
  const remaining = Math.max(0, limit - state.count);

  return { allowed, limit, remaining, resetMs };
}
