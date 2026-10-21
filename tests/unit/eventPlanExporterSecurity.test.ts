import { describe, test, expect } from 'vitest';
import {
  escapeHtml,
  formatEventPlanAsHtml,
} from '@/lib/export/eventPlanExporter';
import { generateMockPlanSuite, calculateBudgetMetrics } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Event Plan Exporter & Security Sanitization', () => {
  test('escapeHtml properly sanitizes dangerous XSS payloads', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
    expect(escapeHtml('Tom & Jerry <"fun"> \'party\'')).toBe(
      'Tom &amp; Jerry &lt;&quot;fun&quot;&gt; &#39;party&#39;'
    );
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  test('formatEventPlanAsHtml renders safely without injecting unescaped user HTML', () => {
    const maliciousBrief: EventBrief = {
      eventType: 'Custom',
      eventTitle: 'Grand <img src=x onerror=alert(1)> Gala',
      targetDate: '2026-12-31',
      city: 'Metropolis <script>alert(2)</script>',
      venueType: 'Indoor Banquet',
      guestCount: 50,
      budgetTotal: 10000,
      currency: 'USD',
      themePreference: 'Dark & Moody <iframe src=javascript:alert(3)>',
      dietaryRestrictions: ['None'],
      accessibilityRequirements: [],
      vibeAndPriorities: [],
    };

    const suite = generateMockPlanSuite(maliciousBrief);
    const plan = suite.detailedPlans['concept-1'];
    // inject malicious text in task and vendor
    plan.tasks[0].title = 'Review <svg onload=alert(4)> contract';
    plan.vendorDirectory[0].name = 'Dangerous <b onmouseover=alert(5)>Vendor</b>';

    const metrics = calculateBudgetMetrics(maliciousBrief.budgetTotal, plan.budgetBreakdown);
    const html = formatEventPlanAsHtml(maliciousBrief, plan, metrics);

    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<script>alert(2)');
    expect(html).not.toContain('<svg onload=alert(4)>');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&lt;script&gt;alert(2)&lt;/script&gt;');
    expect(html).toContain('&lt;svg onload=alert(4)&gt;');
  });
});
