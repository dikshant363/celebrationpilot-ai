import { describe, test, expect } from 'vitest';
import { formatEventPlanAsHtml } from '@/lib/export/eventPlanExporter';
import { generateMockPlanSuite, calculateBudgetMetrics } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Event Plan Exporter', () => {
  const brief: EventBrief = {
    eventType: 'Anniversary',
    eventTitle: 'Silver Jubilee Gala',
    targetDate: '2026-11-15',
    city: 'Chicago, IL',
    venueType: 'Indoor Banquet',
    guestCount: 80,
    budgetTotal: 20000,
    currency: 'USD',
    themePreference: 'Silver & Emerald Romance',
    dietaryRestrictions: ['Vegetarian'],
    accessibilityRequirements: [],
    vibeAndPriorities: [],
  };

  test('formats comprehensive HTML dossier containing all core event sections', () => {
    const suite = generateMockPlanSuite(brief);
    const plan = suite.detailedPlans['concept-1'];
    const metrics = calculateBudgetMetrics(brief.budgetTotal, plan.budgetBreakdown);

    const html = formatEventPlanAsHtml(brief, plan, metrics);

    expect(html).toContain('Silver Jubilee Gala');
    expect(html).toContain('Chicago, IL');
    expect(html).toContain('Run of Show / Master Schedule');
    expect(html).toContain('Budget Breakdown & Allocation');
    expect(html).toContain('Milestone Task Checklist');
    expect(html).toContain('Guest & RSVP Registry Summary');
    expect(html).toContain('Vendor Directory & Contracts');
    expect(html).toContain('CelebrationPilot AI');
  });
});
