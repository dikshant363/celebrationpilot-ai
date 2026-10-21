import { describe, test, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimitsForTesting } from '@/lib/security/rateLimiter';
import { validateCustomApiKey } from '@/lib/validation/eventBriefSchema';

describe('Unit: Security & Rate Limiting Engine', () => {
  beforeEach(() => {
    resetRateLimitsForTesting();
  });

  test('allows requests within rate limit window', () => {
    const ip = '192.168.1.100';
    const limit = 5;

    for (let i = 1; i <= limit; i++) {
      const res = checkRateLimit(ip, limit, 60000);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(limit - i);
    }
  });

  test('blocks requests that exceed rate limit and specifies resetSeconds', () => {
    const ip = '10.0.0.5';
    const limit = 3;

    // First 3 pass
    for (let i = 0; i < limit; i++) {
      expect(checkRateLimit(ip, limit, 60000).success).toBe(true);
    }

    // 4th is blocked
    const blockedRes = checkRateLimit(ip, limit, 60000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetSeconds).toBeGreaterThan(0);
  });

  test('tracks distinct IP addresses independently', () => {
    const ipA = '10.0.0.1';
    const ipB = '10.0.0.2';
    const limit = 2;

    checkRateLimit(ipA, limit, 60000);
    checkRateLimit(ipA, limit, 60000);
    expect(checkRateLimit(ipA, limit, 60000).success).toBe(false);

    // ipB should still be allowed
    expect(checkRateLimit(ipB, limit, 60000).success).toBe(true);
  });

  test('validates custom Gemini API key formats securely', () => {
    // Valid standard keys
    expect(validateCustomApiKey('AIzaSyD-1234567890abcdefghijklmnopqrstuvw').isValid).toBe(true);
    expect(validateCustomApiKey('AQ_Ab8-ValidKeyFormat12345678901234567890').isValid).toBe(true);
    expect(validateCustomApiKey(undefined).isValid).toBe(true);
    expect(validateCustomApiKey('').isValid).toBe(true);

    // Invalid keys: too short, malicious characters, spaces
    expect(validateCustomApiKey('short').isValid).toBe(false);
    expect(validateCustomApiKey('AIzaSy<script>alert(1)</script>').isValid).toBe(false);
    expect(validateCustomApiKey('AIzaSy key with spaces 12345678901234567890').isValid).toBe(false);
    expect(validateCustomApiKey('a'.repeat(150)).isValid).toBe(false);
  });
});
