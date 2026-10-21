import { describe, test, expect, beforeEach } from 'vitest';
import { eventStore } from '@/lib/context/eventStore';
import { generateMockPlanSuite } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Event Store & Hydration-Safe Persistence', () => {
  const sampleBrief: EventBrief = {
    eventType: 'Birthday',
    eventTitle: '30th Rooftop Soirée',
    targetDate: '2026-12-10',
    city: 'Miami, FL',
    venueType: 'Rooftop',
    guestCount: 60,
    budgetTotal: 10000,
    currency: 'USD',
    themePreference: 'Neon Chic',
    dietaryRestrictions: [],
    accessibilityRequirements: [],
    vibeAndPriorities: [],
  };

  beforeEach(() => {
    localStorage.clear();
    eventStore.reset();
  });

  test('initializes with clean server state', () => {
    const snap = eventStore.getSnapshot();
    expect(snap.brief).toBeNull();
    expect(snap.planSuite).toBeNull();
    expect(snap.selectedConceptId).toBe('concept-1');
  });

  test('persists state changes to localStorage', () => {
    const suite = generateMockPlanSuite(sampleBrief);
    eventStore.setState((prev) => ({
      ...prev,
      brief: sampleBrief,
      planSuite: suite,
      selectedConceptId: 'concept-2',
    }));

    expect(localStorage.getItem('celebrationpilot_brief')).toContain('30th Rooftop Soirée');
    expect(localStorage.getItem('celebrationpilot_concept_id')).toBe('concept-2');
  });

  test('hydrates state from localStorage correctly', () => {
    const suite = generateMockPlanSuite(sampleBrief);
    localStorage.setItem('celebrationpilot_brief', JSON.stringify(sampleBrief));
    localStorage.setItem('celebrationpilot_suite', JSON.stringify(suite));
    localStorage.setItem('celebrationpilot_concept_id', 'concept-3');
    localStorage.setItem('celebrationpilot_user_api_key', 'test-key-12345');

    eventStore.hydrate();

    const snap = eventStore.getSnapshot();
    expect(snap.brief?.eventTitle).toBe('30th Rooftop Soirée');
    expect(snap.selectedConceptId).toBe('concept-3');
    expect(snap.userApiKey).toBe('test-key-12345');
    expect(snap.hasHydrated).toBe(true);
  });

  test('safely handles corrupted localStorage during hydration', () => {
    localStorage.setItem('celebrationpilot_brief', 'invalid-json{');
    localStorage.setItem('celebrationpilot_suite', 'broken-json[');

    eventStore.hydrate();

    const snap = eventStore.getSnapshot();
    expect(snap.brief).toBeNull();
    expect(snap.planSuite).toBeNull();
    expect(snap.hasHydrated).toBe(true);
  });

  test('switches active concept without altering other concept plans', () => {
    const suite = generateMockPlanSuite(sampleBrief);
    eventStore.setState((prev) => ({
      ...prev,
      brief: sampleBrief,
      planSuite: suite,
    }));

    eventStore.selectConcept('concept-2');
    expect(eventStore.getSnapshot().selectedConceptId).toBe('concept-2');
    expect(localStorage.getItem('celebrationpilot_concept_id')).toBe('concept-2');
  });

  test('updates task status immutably in the current plan', () => {
    const suite = generateMockPlanSuite(sampleBrief);
    eventStore.setState((prev) => ({
      ...prev,
      brief: sampleBrief,
      planSuite: suite,
      selectedConceptId: 'concept-1',
    }));

    const firstTaskId = suite.detailedPlans['concept-1'].tasks[0].id;
    eventStore.updateTaskStatus(firstTaskId, 'Completed');

    const updatedTask = eventStore
      .getSnapshot()
      .planSuite?.detailedPlans['concept-1'].tasks.find((t) => t.id === firstTaskId);
    expect(updatedTask?.status).toBe('Completed');
  });

  test('adds a new guest to the active plan', () => {
    const suite = generateMockPlanSuite(sampleBrief);
    eventStore.setState((prev) => ({
      ...prev,
      brief: sampleBrief,
      planSuite: suite,
      selectedConceptId: 'concept-1',
    }));

    eventStore.addGuest({
      name: 'Leonardo DiCaprio',
      category: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegan',
      plusOne: true,
    });

    const guests = eventStore.getSnapshot().planSuite?.detailedPlans['concept-1'].guestList;
    expect(guests?.[0].name).toBe('Leonardo DiCaprio');
    expect(guests?.[0].rsvpStatus).toBe('Confirmed');
  });
});
