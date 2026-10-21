import { describe, test, expect } from 'vitest';
import { POST } from '@/app/api/generate-plan/route';
import { NextRequest } from 'next/server';

describe('API Route: POST /api/generate-plan', () => {
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
});
