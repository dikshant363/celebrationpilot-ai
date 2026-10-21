import { describe, test, expect } from 'vitest';
import { generateMockPlanSuite } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Domain-Specific Event Plan Generation', () => {
  test('generates wedding-specific schedules, concepts, and deliverables', () => {
    const weddingBrief: EventBrief = {
      eventType: 'Wedding',
      eventTitle: 'Sarah & Michael Nuptials',
      targetDate: '2026-10-10',
      city: 'Napa Valley, CA',
      venueType: 'Outdoor Garden',
      guestCount: 120,
      budgetTotal: 45000,
      currency: 'USD',
      themePreference: 'Modern Wine Country Elegance',
      dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
      accessibilityRequirements: ['Wheelchair Ramp Access'],
      vibeAndPriorities: ['Live Band', 'Romantic Lighting'],
    };

    const suite = generateMockPlanSuite(weddingBrief);
    expect(suite.concepts[0].title).toContain('Bridal');
    expect(suite.detailedPlans['concept-1']).toBeDefined();

    const plan = suite.detailedPlans['concept-1'];
    const scheduleTitles = plan.schedule.map((s) => s.title);
    expect(scheduleTitles.some((t) => t.includes('Ceremony') || t.includes('Vows'))).toBe(true);
    expect(scheduleTitles.some((t) => t.includes('First Dance'))).toBe(true);

    const taskTitles = plan.tasks.map((t) => t.title);
    expect(taskTitles.some((t) => t.includes('Officiant') || t.includes('Ceremony'))).toBe(true);
  });

  test('generates corporate-specific schedules, conventions, and deliverables', () => {
    const corporateBrief: EventBrief = {
      eventType: 'Corporate',
      eventTitle: 'Global AI Summit 2026',
      targetDate: '2026-11-12',
      city: 'Seattle, WA',
      venueType: 'Indoor Banquet',
      guestCount: 300,
      budgetTotal: 75000,
      currency: 'USD',
      themePreference: 'Clean Tech Minimalist',
      dietaryRestrictions: ['Halal', 'Vegan'],
      accessibilityRequirements: ['Assisted Listening Device'],
      vibeAndPriorities: ['Interactive Keynotes'],
    };

    const suite = generateMockPlanSuite(corporateBrief);
    expect(suite.concepts[0].title).toContain('Executive Leadership');

    const plan = suite.detailedPlans['concept-1'];
    const scheduleTitles = plan.schedule.map((s) => s.title);
    expect(scheduleTitles.some((t) => t.includes('Keynote'))).toBe(true);
    expect(scheduleTitles.some((t) => t.includes('Panel'))).toBe(true);

    const taskTitles = plan.tasks.map((t) => t.title);
    expect(taskTitles.some((t) => t.includes('AV') || t.includes('Speaker'))).toBe(true);
  });
});
