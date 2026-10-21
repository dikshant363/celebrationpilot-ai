/**
 * In-memory sliding-window rate limiter for serverless Next.js API routes.
 * Tracks client IP requests with automatic cleanup of expired timestamps.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipStore = new Map<string, RateLimitRecord>();
const CLEANUP_INTERVAL_MS = 60000;
let lastCleanup = Date.now();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  clientIp: string,
  limit: number = 20,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();

  // Periodic cleanup of stale IPs
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    const windowStart = now - windowMs;
    for (const [ip, record] of ipStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        ipStore.delete(ip);
      }
    }
  }

  const windowStart = now - windowMs;
  let record = ipStore.get(clientIp);

  if (!record) {
    record = { timestamps: [] };
    ipStore.set(clientIp, record);
  }

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const oldest = record.timestamps[0];
  const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));

  return {
    success: true,
    limit,
    remaining,
    resetSeconds,
  };
}

export function resetRateLimitsForTesting() {
  ipStore.clear();
}
