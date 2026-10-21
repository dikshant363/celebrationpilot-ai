import { describe, test, expect, beforeEach } from 'vitest';
import { eventStore } from '@/lib/context/eventStore';
import { generateEventPlanWithGemini } from '@/lib/ai/gemini';
import { formatEventPlanAsHtml } from '@/lib/export/eventPlanExporter';
import { calculateBudgetMetrics } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Integration: Full Celebration Lifecycle Workflow', () => {
  const brief: EventBrief = {
    eventType: 'Birthday',
    eventTitle: '40th Milestone Celebration',
    targetDate: '2026-11-20',
    city: 'Seattle, WA',
    venueType: 'Rooftop',
    guestCount: 50,
    budgetTotal: 12000,
    currency: 'USD',
    themePreference: 'Modern Emerald & Gold',
    dietaryRestrictions: ['Vegan'],
    accessibilityRequirements: ['Wheelchair Ramp Access'],
    vibeAndPriorities: ['Live DJ', 'Interactive Stations'],
  };

  beforeEach(() => {
    localStorage.clear();
    eventStore.reset();
    process.env.E2E_MOCK_AI = 'true';
  });

  test('executes end-to-end event planning lifecycle with state synchronization', async () => {
    // 1. Generate plan suite
    const suite = await generateEventPlanWithGemini(brief);
    expect(suite.concepts).toHaveLength(3);

    // 2. Commit to store with concept-2 chosen
    eventStore.setState((prev) => ({
      ...prev,
      brief,
      planSuite: suite,
      selectedConceptId: 'concept-2',
    }));

    const snap = eventStore.getSnapshot();
    expect(snap.selectedConceptId).toBe('concept-2');

    // 3. Update task in concept-2
    const currentTasks = snap.planSuite?.detailedPlans['concept-2'].tasks || [];
    expect(currentTasks.length).toBeGreaterThan(0);
    const targetTaskId = currentTasks[0].id;

    eventStore.updateTaskStatus(targetTaskId, 'Completed');
    const updatedTasks =
      eventStore.getSnapshot().planSuite?.detailedPlans['concept-2'].tasks || [];
    expect(updatedTasks.find((t) => t.id === targetTaskId)?.status).toBe('Completed');

    // Ensure concept-1 task was NOT touched
    const concept1Task =
      eventStore.getSnapshot().planSuite?.detailedPlans['concept-1'].tasks.find(
        (t) => t.id === targetTaskId
      );
    expect(concept1Task?.status).not.toBe('Completed');

    // 4. Update guest RSVP
    const currentGuests = snap.planSuite?.detailedPlans['concept-2'].guestList || [];
    const targetGuestId = currentGuests[0].id;
    eventStore.updateGuestRSVP(targetGuestId, 'Confirmed');

    const updatedGuests =
      eventStore.getSnapshot().planSuite?.detailedPlans['concept-2'].guestList || [];
    expect(updatedGuests.find((g) => g.id === targetGuestId)?.rsvpStatus).toBe('Confirmed');

    // 5. Generate and verify HTML export
    const activePlan = eventStore.getSnapshot().planSuite?.detailedPlans['concept-2'];
    expect(activePlan).toBeDefined();
    if (activePlan) {
      const metrics = calculateBudgetMetrics(brief.budgetTotal, activePlan.budgetBreakdown);
      const html = formatEventPlanAsHtml(brief, activePlan, metrics);
      expect(html).toContain('40th Milestone Celebration');
      expect(html).toContain(activePlan.title);
      expect(html).toContain('Seattle, WA');
      expect(html).toContain('Master Event Dossier');
    }
  });
});
