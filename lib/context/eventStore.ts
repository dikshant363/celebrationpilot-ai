import {
  EventBrief,
  GeneratedPlanSuite,
  DetailedEventPlan,
  TaskItem,
  GuestItem,
  BudgetItem,
  ScheduleItem,
  VendorItem,
  RSVPStatus,
} from '../types/event';

export interface EventStoreState {
  brief: EventBrief | null;
  planSuite: GeneratedPlanSuite | null;
  selectedConceptId: string;
  hasHydrated: boolean;
  userApiKey: string;
}

const serverState: EventStoreState = {
  brief: null,
  planSuite: null,
  selectedConceptId: 'concept-1',
  hasHydrated: false,
  userApiKey: '',
};

let currentState: EventStoreState = { ...serverState };
const listeners = new Set<() => void>();

function mutateCurrentPlan(
  state: EventStoreState,
  mutator: (currentPlan: DetailedEventPlan) => DetailedEventPlan
): EventStoreState {
  if (!state.planSuite) return state;
  const currentPlan = state.planSuite.detailedPlans[state.selectedConceptId];
  if (!currentPlan) return state;

  return {
    ...state,
    planSuite: {
      ...state.planSuite,
      detailedPlans: {
        ...state.planSuite.detailedPlans,
        [state.selectedConceptId]: mutator(currentPlan),
      },
    },
  };
}

export const eventStore = {
  getSnapshot(): EventStoreState {
    return currentState;
  },

  getServerSnapshot(): EventStoreState {
    return serverState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  hydrate() {
    if (typeof window === 'undefined') return;

    let brief: EventBrief | null = null;
    let planSuite: GeneratedPlanSuite | null = null;
    let selectedConceptId = 'concept-1';
    let userApiKey = '';

    try {
      const savedBrief = localStorage.getItem('celebrationpilot_brief');
      if (savedBrief) {
        try {
          brief = JSON.parse(savedBrief);
        } catch {
          console.warn('[EventStore] Corrupted brief in localStorage. Resetting.');
          localStorage.removeItem('celebrationpilot_brief');
        }
      }

      const savedSuite = localStorage.getItem('celebrationpilot_suite');
      if (savedSuite) {
        try {
          const parsed = JSON.parse(savedSuite);
          if (parsed && Array.isArray(parsed.concepts) && parsed.detailedPlans) {
            planSuite = parsed;
          } else {
            localStorage.removeItem('celebrationpilot_suite');
          }
        } catch {
          console.warn('[EventStore] Corrupted planSuite in localStorage. Resetting.');
          localStorage.removeItem('celebrationpilot_suite');
        }
      }

      const savedConceptId = localStorage.getItem('celebrationpilot_concept_id');
      if (savedConceptId && ['concept-1', 'concept-2', 'concept-3'].includes(savedConceptId)) {
        selectedConceptId = savedConceptId;
      }

      const savedApiKey = localStorage.getItem('celebrationpilot_user_api_key');
      if (savedApiKey && typeof savedApiKey === 'string') {
        userApiKey = savedApiKey.trim();
      }

      currentState = {
        brief,
        planSuite,
        selectedConceptId,
        hasHydrated: true,
        userApiKey,
      };

      listeners.forEach((l) => l());
    } catch (e) {
      console.warn('[EventStore] Hydration failure:', e);
      currentState = { ...serverState, hasHydrated: true };
      listeners.forEach((l) => l());
    }
  },

  setState(updater: (prev: EventStoreState) => EventStoreState) {
    const next = updater(currentState);
    currentState = next;

    if (typeof window !== 'undefined') {
      try {
        if (next.brief) {
          localStorage.setItem('celebrationpilot_brief', JSON.stringify(next.brief));
        } else {
          localStorage.removeItem('celebrationpilot_brief');
        }

        if (next.planSuite) {
          localStorage.setItem('celebrationpilot_suite', JSON.stringify(next.planSuite));
        } else {
          localStorage.removeItem('celebrationpilot_suite');
        }

        localStorage.setItem('celebrationpilot_concept_id', next.selectedConceptId);

        if (next.userApiKey) {
          localStorage.setItem('celebrationpilot_user_api_key', next.userApiKey);
        } else {
          localStorage.removeItem('celebrationpilot_user_api_key');
        }
      } catch (e) {
        console.warn('[EventStore] Failed to write localStorage:', e);
      }
    }

    listeners.forEach((l) => l());
  },

  selectConcept(conceptId: string) {
    eventStore.setState((prev) => ({
      ...prev,
      selectedConceptId: conceptId,
      planSuite: prev.planSuite
        ? {
            ...prev.planSuite,
            selectedConceptId: conceptId,
          }
        : null,
    }));
  },

  updateTaskStatus(taskId: string, status: TaskItem['status']) {
    eventStore.setState((prev) =>
      mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        tasks: plan.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        ),
      }))
    );
  },

  addTask(task: Omit<TaskItem, 'id'>) {
    eventStore.setState((prev) => {
      const newTask: TaskItem = {
        ...task,
        id: `custom-t-${Date.now()}`,
      };
      return mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        tasks: [newTask, ...plan.tasks],
      }));
    });
  },

  updateGuestRSVP(guestId: string, rsvpStatus: RSVPStatus) {
    eventStore.setState((prev) =>
      mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        guestList: plan.guestList.map((guest) =>
          guest.id === guestId ? { ...guest, rsvpStatus } : guest
        ),
      }))
    );
  },

  addGuest(guest: Omit<GuestItem, 'id'>) {
    eventStore.setState((prev) => {
      const newGuest: GuestItem = {
        ...guest,
        id: `custom-g-${Date.now()}`,
      };
      return mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        guestList: [newGuest, ...plan.guestList],
      }));
    });
  },

  updateBudgetItem(itemId: string, updates: Partial<BudgetItem>) {
    eventStore.setState((prev) =>
      mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        budgetBreakdown: plan.budgetBreakdown.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }))
    );
  },

  addBudgetItem(item: Omit<BudgetItem, 'id'>) {
    eventStore.setState((prev) => {
      const newItem: BudgetItem = {
        ...item,
        id: `custom-b-${Date.now()}`,
      };
      return mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        budgetBreakdown: [...plan.budgetBreakdown, newItem],
      }));
    });
  },

  addScheduleItem(item: ScheduleItem) {
    eventStore.setState((prev) =>
      mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        schedule: [...plan.schedule, item].sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
      }))
    );
  },

  updateVendor(vendorId: string, updates: Partial<VendorItem>) {
    eventStore.setState((prev) =>
      mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        vendorDirectory: plan.vendorDirectory.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, ...updates } : vendor
        ),
      }))
    );
  },

  addVendor(vendor: Omit<VendorItem, 'id'>) {
    eventStore.setState((prev) => {
      const newVendor: VendorItem = {
        ...vendor,
        id: `custom-v-${Date.now()}`,
      };
      return mutateCurrentPlan(prev, (plan) => ({
        ...plan,
        vendorDirectory: [...plan.vendorDirectory, newVendor],
      }));
    });
  },

  reset() {
    currentState = {
      brief: null,
      planSuite: null,
      selectedConceptId: 'concept-1',
      hasHydrated: typeof window !== 'undefined',
      userApiKey: '',
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('celebrationpilot_brief');
        localStorage.removeItem('celebrationpilot_suite');
        localStorage.removeItem('celebrationpilot_concept_id');
        localStorage.removeItem('celebrationpilot_user_api_key');
      } catch (e) {
        console.warn('[EventStore] Reset error:', e);
      }
    }

    listeners.forEach((l) => l());
  },
};
