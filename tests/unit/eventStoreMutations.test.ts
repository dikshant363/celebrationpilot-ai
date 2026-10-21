import { describe, test, expect, beforeEach } from 'vitest';
import { eventStore } from '@/lib/context/eventStore';
import { generateMockPlanSuite } from '@/lib/ai/mockEventEngine';
import { EventBrief } from '@/lib/types/event';

describe('Unit: Event Store Workspace Mutations', () => {
  const brief: EventBrief = {
    eventType: 'Birthday',
    eventTitle: 'Alex 30th Birthday',
    targetDate: '2026-11-20',
    city: 'Denver, CO',
    venueType: 'Rooftop',
    guestCount: 50,
    budgetTotal: 10000,
    currency: 'USD',
    themePreference: 'Modern Sunset',
    dietaryRestrictions: [],
    accessibilityRequirements: [],
    vibeAndPriorities: [],
  };

  beforeEach(() => {
    eventStore.reset();
    const suite = generateMockPlanSuite(brief);
    eventStore.setState((prev) => ({
      ...prev,
      brief,
      planSuite: suite,
      selectedConceptId: 'concept-1',
    }));
  });

  test('adds and updates custom budget items in active plan', () => {
    eventStore.addBudgetItem({
      category: 'Specialty Lighting',
      allocated: 1200,
      spent: 600,
      notes: 'Custom neon sign',
      isVerifiedQuote: true,
    });

    let current = eventStore.getSnapshot();
    let plan = current.planSuite?.detailedPlans[current.selectedConceptId];
    const addedItem = plan?.budgetBreakdown.find((b) => b.category === 'Specialty Lighting');
    expect(addedItem).toBeDefined();
    expect(addedItem?.allocated).toBe(1200);
    expect(addedItem?.spent).toBe(600);

    // Update the item
    if (addedItem) {
      eventStore.updateBudgetItem(addedItem.id, { spent: 900 });
      current = eventStore.getSnapshot();
      plan = current.planSuite?.detailedPlans[current.selectedConceptId];
      const updated = plan?.budgetBreakdown.find((b) => b.id === addedItem.id);
      expect(updated?.spent).toBe(900);
    }
  });

  test('adds schedule milestone sorted chronologically', () => {
    eventStore.addScheduleItem({
      time: '17:30',
      title: 'Sunset Champagne Pour',
      description: 'Host pours vintage reserve',
      lead: 'Sommelier',
    });

    const current = eventStore.getSnapshot();
    const plan = current.planSuite?.detailedPlans[current.selectedConceptId];
    const item = plan?.schedule.find((s) => s.title === 'Sunset Champagne Pour');
    expect(item).toBeDefined();
    expect(item?.time).toBe('17:30');
  });

  test('adds and updates vendor directory entries', () => {
    eventStore.addVendor({
      name: 'Artisan Bloom Studio',
      service: 'Bespoke Centerpieces',
      estimatedCost: 1500,
      actualCost: null,
      status: 'Quoted',
      contact: 'orders@artisanbloom.com',
    });

    let current = eventStore.getSnapshot();
    let plan = current.planSuite?.detailedPlans[current.selectedConceptId];
    const vendor = plan?.vendorDirectory.find((v) => v.name === 'Artisan Bloom Studio');
    expect(vendor).toBeDefined();
    expect(vendor?.status).toBe('Quoted');

    if (vendor) {
      eventStore.updateVendor(vendor.id, { status: 'Booked', actualCost: 1450 });
      current = eventStore.getSnapshot();
      plan = current.planSuite?.detailedPlans[current.selectedConceptId];
      const updated = plan?.vendorDirectory.find((v) => v.id === vendor.id);
      expect(updated?.status).toBe('Booked');
      expect(updated?.actualCost).toBe(1450);
    }
  });
});
