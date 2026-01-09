export function getClientIpFromHeaders(headers: Headers): string {
  // Typical proxy/CDN format: "client, proxy1, proxy2"
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  // Last resort (may be useless on some platforms)
  return "unknown";
}

export function getClientIp(req: Request): string {
  return getClientIpFromHeaders(req.headers);
}
