import { describe, test, expect } from 'vitest';
import { validateEventBrief } from '@/lib/validation/eventBriefSchema';

describe('Unit: Event Brief Validation Schema', () => {
  const validBrief = {
    eventType: 'Birthday',
    eventTitle: 'Golden Jubilee Celebration',
    targetDate: '2026-12-25',
    city: 'New York, NY',
    venueType: 'Rooftop',
    guestCount: 50,
    budgetTotal: 15000,
    currency: 'USD',
    themePreference: 'Modern Classic Gold',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    accessibilityRequirements: ['Wheelchair Ramp Access'],
    vibeAndPriorities: ['Live Band', 'Plated Dining'],
    specialRequests: 'Special toast at 8 PM.',
  };

  test('validates and sanitizes a complete, correct event brief', () => {
    const res = validateEventBrief(validBrief);
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual({});
    expect(res.sanitized).toBeDefined();
    expect(res.sanitized?.eventTitle).toBe('Golden Jubilee Celebration');
    expect(res.sanitized?.guestCount).toBe(50);
  });

  test('rejects non-object or null input', () => {
    expect(validateEventBrief(null).isValid).toBe(false);
    expect(validateEventBrief('invalid').isValid).toBe(false);
  });

  test('rejects invalid or missing eventType', () => {
    const res = validateEventBrief({ ...validBrief, eventType: 'InvalidType' });
    expect(res.isValid).toBe(false);
    expect(res.errors.eventType).toBeDefined();
  });

  test('rejects event title that is too short or too long', () => {
    expect(validateEventBrief({ ...validBrief, eventTitle: 'Hi' }).isValid).toBe(false);
    expect(
      validateEventBrief({ ...validBrief, eventTitle: 'A'.repeat(101) }).isValid
    ).toBe(false);
  });

  test('rejects invalid guest counts', () => {
    expect(validateEventBrief({ ...validBrief, guestCount: 0 }).isValid).toBe(false);
    expect(validateEventBrief({ ...validBrief, guestCount: 1 }).isValid).toBe(false);
    expect(validateEventBrief({ ...validBrief, guestCount: 50000 }).isValid).toBe(false);
  });

  test('rejects budget below minimum boundary', () => {
    expect(validateEventBrief({ ...validBrief, budgetTotal: 50 }).isValid).toBe(false);
  });

  test('sanitizes malicious HTML tags from string inputs', () => {
    const res = validateEventBrief({
      ...validBrief,
      eventTitle: '<script>alert("hack")</script>My Party',
      themePreference: '<b>Bold Theme</b>',
    });
    expect(res.isValid).toBe(true);
    expect(res.sanitized?.eventTitle).not.toContain('<script>');
    expect(res.sanitized?.eventTitle).toBe('scriptalert("hack")/scriptMy Party');
  });
});
