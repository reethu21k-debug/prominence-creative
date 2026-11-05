import "server-only";

// Best-effort, in-memory sliding-window limiter. On serverless hosting each warm instance keeps
// its own counters, so this blunts bursts and simple bots but is not a hard global limit.
// The contact action adds a database-backed per-email check on top (see contact/actions.ts).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep memory bounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(h: Headers): string {
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip") || "unknown";
}
