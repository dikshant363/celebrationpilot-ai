import { describe, test, expect } from 'vitest';
import { validateAndRepairPlanSuite } from '@/lib/ai/gemini';
import { EventBrief } from '@/lib/types/event';

describe('Unit: AI Gateway Schema Validation & Repair Engine', () => {
  const mockBrief: EventBrief = {
    eventType: 'Birthday',
    eventTitle: '30th Golden Jubilee',
    targetDate: '2026-11-20',
    city: 'San Francisco, CA',
    venueType: 'Rooftop',
    guestCount: 60,
    budgetTotal: 15000,
    currency: 'USD',
    themePreference: 'Velvet & Gold',
    dietaryRestrictions: ['Vegetarian'],
    accessibilityRequirements: [],
    vibeAndPriorities: ['Live Band'],
  };

  test('returns null for empty, non-object, or truncated concepts arrays', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(validateAndRepairPlanSuite(null as any, mockBrief)).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(validateAndRepairPlanSuite({} as any, mockBrief)).toBeNull();
    expect(
      validateAndRepairPlanSuite(
        { concepts: [{ id: 'concept-1' }] },
        mockBrief
      )
    ).toBeNull();
  });

  test('safely repairs incomplete concept properties with domain defaults', () => {
    const incompletePayload = {
      concepts: [
        { id: 'concept-1', title: 'Concept One' }, // missing categoryShares, cateringSummary, etc.
        { id: 'concept-2', title: 'Concept Two' },
        { id: 'concept-3', title: 'Concept Three' },
      ],
      detailedPlans: {}, // empty plans
    };

    const repaired = validateAndRepairPlanSuite(incompletePayload, mockBrief);
    expect(repaired).not.toBeNull();
    expect(repaired?.concepts.length).toBe(3);

    // Verify repair filled in categoryShares and scores
    const c1 = repaired?.concepts[0];
    expect(c1?.title).toBe('Concept One');
    expect(c1?.categoryShares).toBeDefined();
    expect(c1?.categoryShares.venue).toBeGreaterThan(0);
    expect(c1?.feasibilityScore).toBeGreaterThanOrEqual(50);

    // Verify detailedPlans were reconstructed gracefully
    const plan1 = repaired?.detailedPlans['concept-1'];
    expect(plan1).toBeDefined();
    expect(plan1?.schedule.length).toBeGreaterThan(0);
    expect(plan1?.budgetBreakdown.length).toBeGreaterThan(0);
    expect(plan1?.guestList.length).toBeGreaterThan(0);
    expect(plan1?.vendorDirectory.length).toBeGreaterThan(0);
  });
});
