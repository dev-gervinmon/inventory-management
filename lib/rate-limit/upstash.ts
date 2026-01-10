import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

type UpstashRestConfig = {
  url: string;
  token: string;
};

function getUpstashRestConfig(): UpstashRestConfig | null {
  // Native Upstash env vars
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    null;

  if (!url || !token) return null;
  return { url, token };
}

export function hasSharedRateLimitStore(): boolean {
  return getUpstashRestConfig() !== null;
}

let redisSingleton: Redis | null = null;

function getRedis(): Redis {
  if (redisSingleton) return redisSingleton;

  const cfg = getUpstashRestConfig();
  if (!cfg) {
    throw new Error(
      "Missing Upstash Redis REST config. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel KV: KV_REST_API_URL + KV_REST_API_TOKEN)."
    );
  }

  redisSingleton = new Redis({ url: cfg.url, token: cfg.token });
  return redisSingleton;
}

const limiterCache = new Map<string, Ratelimit>();

export function getFixedWindowLimiter(opts: {
  limit: number;
  windowMs: number;
  prefix?: string;
}): Ratelimit {
  const windowSeconds = Math.max(1, Math.ceil(opts.windowMs / 1000));
  const key = `${opts.prefix ?? ""}|${opts.limit}|${windowSeconds}`;

  const existing = limiterCache.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: getRedis(),
    // Fixed-window is consistent with the existing in-memory implementation.
    limiter: Ratelimit.fixedWindow(opts.limit, `${windowSeconds} s`),
    prefix: opts.prefix,
  });

  limiterCache.set(key, limiter);
  return limiter;
}
