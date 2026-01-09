export function rateLimitHeaders(input: {
  limit: number;
  remaining: number;
  resetMs: number;
}) {
  const headers = new Headers();

  // Draft RFC-style fields that many clients/proxies understand.
  headers.set("RateLimit-Limit", String(input.limit));
  headers.set("RateLimit-Remaining", String(input.remaining));
  headers.set("RateLimit-Reset", String(Math.ceil(input.resetMs / 1000)));

  // Common legacy fields.
  headers.set("X-RateLimit-Limit", String(input.limit));
  headers.set("X-RateLimit-Remaining", String(input.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(input.resetMs / 1000)));

  return headers;
}

export function retryAfterSeconds(resetMs: number, nowMs: number) {
  return Math.max(0, Math.ceil((resetMs - nowMs) / 1000));
}
