'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import {
  EventBrief,
  GeneratedPlanSuite,
  DetailedEventPlan,
  BudgetMetrics,
  TaskItem,
  GuestItem,
  BudgetItem,
  ScheduleItem,
  VendorItem,
  RSVPStatus,
} from '../types/event';
import { eventStore } from './eventStore';
import { calculateBudgetMetrics } from '../ai/mockEventEngine';

interface EventContextType {
  brief: EventBrief | null;
  planSuite: GeneratedPlanSuite | null;
  selectedConceptId: string;
  currentPlan: DetailedEventPlan | null;
  budgetMetrics: BudgetMetrics | null;
  isGenerating: boolean;
  hasHydrated: boolean;
  generatePlan: (brief: EventBrief) => Promise<boolean>;
  selectConcept: (conceptId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateGuestRSVP: (guestId: string, status: RSVPStatus) => void;
  addGuest: (guest: Omit<GuestItem, 'id'>) => void;
  updateBudgetItem: (itemId: string, updates: Partial<BudgetItem>) => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  addScheduleItem: (item: ScheduleItem) => void;
  updateVendor: (vendorId: string, updates: Partial<VendorItem>) => void;
  addVendor: (vendor: Omit<VendorItem, 'id'>) => void;
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  resetAll: () => void;
}

const defaultContext: EventContextType = {
  brief: null,
  planSuite: null,
  selectedConceptId: 'concept-1',
  currentPlan: null,
  budgetMetrics: null,
  isGenerating: false,
  hasHydrated: false,
  generatePlan: async () => false,
  selectConcept: () => {},
  updateTaskStatus: () => {},
  addTask: () => {},
  updateGuestRSVP: () => {},
  addGuest: () => {},
  updateBudgetItem: () => {},
  addBudgetItem: () => {},
  addScheduleItem: () => {},
  updateVendor: () => {},
  addVendor: () => {},
  userApiKey: '',
  setUserApiKey: () => {},
  isApiKeyModalOpen: false,
  setIsApiKeyModalOpen: () => {},
  resetAll: () => {},
};

const EventContext = createContext<EventContextType>(defaultContext);

export function EventProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(
    eventStore.subscribe,
    eventStore.getSnapshot,
    eventStore.getServerSnapshot
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    eventStore.hydrate();
  }, []);

  const currentPlan =
    store.planSuite?.detailedPlans[store.selectedConceptId] ||
    (store.planSuite?.concepts[0]?.id
      ? store.planSuite.detailedPlans[store.planSuite.concepts[0].id]
      : null) ||
    null;

  const budgetMetrics =
    store.brief && currentPlan
      ? {
          ...calculateBudgetMetrics(store.brief.budgetTotal, currentPlan.budgetBreakdown),
          perGuestCost:
            store.brief.guestCount > 0
              ? Math.round(store.brief.budgetTotal / store.brief.guestCount)
              : 0,
        }
      : null;

  const generatePlan = async (briefData: EventBrief): Promise<boolean> => {
    setIsGenerating(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (store.userApiKey && store.userApiKey.trim().length > 10) {
        headers['x-gemini-api-key'] = store.userApiKey.trim();
      }

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers,
        body: JSON.stringify(briefData),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const planSuite: GeneratedPlanSuite = await res.json();

      eventStore.setState((prev) => ({
        ...prev,
        brief: briefData,
        planSuite,
        selectedConceptId: planSuite.selectedConceptId || 'concept-1',
      }));

      return true;
    } catch (err) {
      console.error('[EventContext] Plan generation error:', err);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const setUserApiKey = (key: string) => {
    eventStore.setState((prev) => ({
      ...prev,
      userApiKey: key.trim(),
    }));
  };

  return (
    <EventContext.Provider
      value={{
        brief: store.brief,
        planSuite: store.planSuite,
        selectedConceptId: store.selectedConceptId,
        currentPlan,
        budgetMetrics,
        isGenerating,
        hasHydrated: store.hasHydrated,
        generatePlan,
        selectConcept: eventStore.selectConcept,
        updateTaskStatus: eventStore.updateTaskStatus,
        addTask: eventStore.addTask,
        updateGuestRSVP: eventStore.updateGuestRSVP,
        addGuest: eventStore.addGuest,
        updateBudgetItem: eventStore.updateBudgetItem,
        addBudgetItem: eventStore.addBudgetItem,
        addScheduleItem: eventStore.addScheduleItem,
        updateVendor: eventStore.updateVendor,
        addVendor: eventStore.addVendor,
        userApiKey: store.userApiKey,
        setUserApiKey,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        resetAll: eventStore.reset,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent(): EventContextType {
  const context = useContext(EventContext);
  return context || defaultContext;
}
