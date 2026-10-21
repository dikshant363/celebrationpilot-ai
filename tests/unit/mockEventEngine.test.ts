import { describe, test, expect } from 'vitest';
import { generateMockPlanSuite } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Mock Event Engine & Three Archetypes', () => {
  const brief: EventBrief = {
    eventType: 'Wedding',
    eventTitle: 'Sunset Botanical Wedding',
    targetDate: '2026-10-30',
    city: 'Charleston, SC',
    venueType: 'Outdoor Garden',
    guestCount: 100,
    budgetTotal: 25000,
    currency: 'USD',
    themePreference: 'Romantic Southern Garden',
    dietaryRestrictions: ['Vegetarian'],
    accessibilityRequirements: ['Wheelchair Ramp Access'],
    vibeAndPriorities: ['Live Band', 'Plated Dining'],
    specialRequests: 'Include midnight sparkler send-off.',
  };

  test('generates exactly three distinct, non-empty event concepts', () => {
    const suite = generateMockPlanSuite(brief);
    expect(suite.concepts).toHaveLength(3);

    const ids = suite.concepts.map((c) => c.id);
    expect(ids).toEqual(['concept-1', 'concept-2', 'concept-3']);

    // Assert distinct titles and vibes
    const titles = new Set(suite.concepts.map((c) => c.title));
    expect(titles.size).toBe(3);
  });

  test('budget estimates for all 3 concepts respect the total budget constraint', () => {
    const suite = generateMockPlanSuite(brief);
    suite.concepts.forEach((concept) => {
      expect(concept.budgetEstimate).toBeLessThanOrEqual(brief.budgetTotal);
    });
  });

  test('each concept has a corresponding detailed plan in detailedPlans', () => {
    const suite = generateMockPlanSuite(brief);
    ['concept-1', 'concept-2', 'concept-3'].forEach((id) => {
      const plan = suite.detailedPlans[id];
      expect(plan).toBeDefined();
      expect(plan.conceptId).toBe(id);
      expect(plan.schedule.length).toBeGreaterThan(4);
      expect(plan.budgetBreakdown.length).toBeGreaterThan(4);
      expect(plan.tasks.length).toBeGreaterThan(4);
      expect(plan.guestList.length).toBeGreaterThan(4);
      expect(plan.vendorDirectory.length).toBeGreaterThan(3);
    });
  });

  test('detailed budget breakdown categories sum properly', () => {
    const suite = generateMockPlanSuite(brief);
    const plan = suite.detailedPlans['concept-1'];
    const totalAllocated = plan.budgetBreakdown.reduce((acc, b) => acc + b.allocated, 0);
    // Should be close or equal to budgetTotal
    expect(totalAllocated).toBeLessThanOrEqual(brief.budgetTotal);
    expect(totalAllocated).toBeGreaterThan(brief.budgetTotal * 0.9);
  });
});
