'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEvent } from '@/lib/context/EventContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScheduleTimeline } from '@/components/workspace/ScheduleTimeline';
import { BudgetManager } from '@/components/workspace/BudgetManager';
import { TaskManager } from '@/components/workspace/TaskManager';
import { GuestManager } from '@/components/workspace/GuestManager';
import { VendorDirectory } from '@/components/workspace/VendorDirectory';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  DollarSign,
  CheckSquare,
  Users,
  Store,
  Printer,
  Layers,
} from 'lucide-react';

type WorkspaceTab = 'schedule' | 'budget' | 'tasks' | 'guests' | 'vendors';

export default function WorkspacePage() {
  const { brief, planSuite, currentPlan, selectedConceptId, selectConcept, budgetMetrics } =
    useEvent();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('schedule');

  if (!brief || !planSuite || !currentPlan || !budgetMetrics) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="No Active Celebration Workspace"
          description="You haven't initialized an event brief yet. Complete the event brief wizard to generate and manage your celebration timeline, budget, and guest list."
          actionText="Create Celebration Brief"
          actionHref="/planner"
        />
      </div>
    );
  }

  const tabs: Array<{ id: WorkspaceTab; label: string; icon: React.ElementType }> = [
    { id: 'schedule', label: 'Run of Show', icon: Calendar },
    { id: 'budget', label: 'Budget & Math', icon: DollarSign },
    { id: 'tasks', label: 'Checklist & Tasks', icon: CheckSquare },
    { id: 'guests', label: 'Guests & RSVP', icon: Users },
    { id: 'vendors', label: 'Vendors & Quotes', icon: Store },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#e5e5ea] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#137333]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3]">
              Active Celebration Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
            {brief.eventTitle}
          </h1>
          <p className="text-xs text-[#555555] mt-1">
            {brief.eventType} in {brief.city} • {brief.targetDate} • {brief.guestCount} Guests
          </p>
        </div>

        {/* Concept Switcher & Export CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs">
            <Layers className="w-4 h-4 text-[#0071e3]" />
            <label htmlFor="concept-plan-select" className="text-[#555555] font-medium">
              Plan:
            </label>
            <select
              id="concept-plan-select"
              aria-label="Switch celebration concept"
              value={selectedConceptId}
              onChange={(e) => selectConcept(e.target.value)}
              className="font-semibold text-[#1d1d1f] bg-transparent focus:outline-none cursor-pointer"
            >
              {planSuite.concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Link href="/export">
            <Button size="sm" variant="primary">
              <Printer className="w-4 h-4 mr-1.5" />
              Export Dossier
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        role="tablist"
        aria-label="Workspace Sections"
        className="flex items-center gap-2 border-b border-[#e5e5ea] mb-8 overflow-x-auto pb-1"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`workspace-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`workspace-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] ${
                isActive
                  ? 'border-[#0071e3] text-[#0071e3]'
                  : 'border-transparent text-[#555555] hover:text-[#1d1d1f] hover:border-[#d2d2d7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div
        role="tabpanel"
        id={`workspace-panel-${activeTab}`}
        aria-labelledby={`workspace-tab-${activeTab}`}
        className="animate-in fade-in duration-150"
      >
        {activeTab === 'schedule' && <ScheduleTimeline schedule={currentPlan.schedule} />}

        {activeTab === 'budget' && (
          <BudgetManager
            breakdown={currentPlan.budgetBreakdown}
            metrics={budgetMetrics}
            currency={brief.currency}
          />
        )}

        {activeTab === 'tasks' && <TaskManager tasks={currentPlan.tasks} />}

        {activeTab === 'guests' && <GuestManager guests={currentPlan.guestList} />}

        {activeTab === 'vendors' && (
          <VendorDirectory
            vendors={currentPlan.vendorDirectory}
            currency={brief.currency}
          />
        )}
      </div>
    </div>
  );
}
