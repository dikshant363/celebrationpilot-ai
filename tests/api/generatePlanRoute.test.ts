import { describe, test, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/generate-plan/route';
import { NextRequest } from 'next/server';
import { resetRateLimitsForTesting } from '@/lib/security/rateLimiter';

describe('API Route: POST /api/generate-plan', () => {
  beforeEach(() => {
    resetRateLimitsForTesting();
  });

  const validPayload = {
    eventType: 'Birthday',
    eventTitle: 'Epic 25th Birthday Bash',
    targetDate: '2026-11-20',
    city: 'Austin, TX',
    venueType: 'Rooftop',
    guestCount: 40,
    budgetTotal: 8000,
    currency: 'USD',
    themePreference: 'Sunset Rooftop Lounge',
    dietaryRestrictions: ['Vegetarian'],
    accessibilityRequirements: [],
    vibeAndPriorities: ['Live DJ'],
  };

  test('responds with 200 and complete 3-concept suite for valid payload', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.concepts).toBeDefined();
    expect(data.concepts.length).toBe(3);
    expect(data.detailedPlans).toBeDefined();
    expect(data.detailedPlans['concept-1']).toBeDefined();
  });

  test('responds with 400 when user passes malformed or dangerous API key format', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-api-key': 'short', // invalid format
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Invalid API key format');
  });

  test('accepts valid custom Gemini API key header format', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-api-key': 'AIzaSyFakeKeyForValidationTest1234567890123',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test('responds with 400 when required fields are missing or invalid', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'InvalidType' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  test('responds with 400 when payload is malformed JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid-json',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Malformed or invalid JSON payload');
  });

  test('responds with 413 when content-length exceeds 32KB', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'content-length': '50000',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  test('enforces rate limit with 429 when client IP floods requests', async () => {
    const ip = '203.0.113.42';

    // Send 20 requests (the limit)
    for (let i = 0; i < 20; i++) {
      const req = new NextRequest('http://localhost:3000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify(validPayload),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 21st request must trigger 429 Too Many Requests
    const floodedReq = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(validPayload),
    });
    const floodRes = await POST(floodedReq);
    expect(floodRes.status).toBe(429);
    expect(floodRes.headers.get('Retry-After')).toBeDefined();
  });
});
