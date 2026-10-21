import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScheduleTimeline } from '@/components/workspace/ScheduleTimeline';
import { BudgetManager } from '@/components/workspace/BudgetManager';
import { TaskManager } from '@/components/workspace/TaskManager';
import { GuestManager } from '@/components/workspace/GuestManager';
import { EventProvider } from '@/lib/context/EventContext';
import { ScheduleItem, BudgetItem, TaskItem, GuestItem } from '@/lib/types/event';

describe('Component: Workspace Feature Tabs', () => {
  test('ScheduleTimeline renders run of show items', () => {
    const schedule: ScheduleItem[] = [
      { time: '17:00', title: 'Welcome Drinks', description: 'Champagne toast in courtyard', lead: 'Host' },
      { time: '18:30', title: 'Dinner Service', description: 'Plated dinner begins', lead: 'Catering Lead' },
    ];

    render(<ScheduleTimeline schedule={schedule} />);
    expect(screen.getByText('Master Run of Show')).toBeInTheDocument();
    expect(screen.getByText('17:00')).toBeInTheDocument();
    expect(screen.getByText('Welcome Drinks')).toBeInTheDocument();
    expect(screen.getByText('Dinner Service')).toBeInTheDocument();
  });

  test('BudgetManager renders budget metrics and category allocations', () => {
    const breakdown: BudgetItem[] = [
      { id: 'b1', category: 'Venue', allocated: 5000, spent: 3000, notes: 'Ballroom rental', isVerifiedQuote: true },
      { id: 'b2', category: 'Catering', allocated: 4000, spent: 2000, notes: 'Buffet', isVerifiedQuote: false },
    ];
    const metrics = {
      totalBudget: 10000,
      totalAllocated: 9000,
      totalSpent: 5000,
      remainingBudget: 5000,
      isOverBudget: false,
      overBudgetAmount: 0,
      perGuestCost: 100,
      verifiedQuotePercentage: 50,
      verdict: 'Optimal' as const,
    };

    render(
      <EventProvider>
        <BudgetManager breakdown={breakdown} metrics={metrics} currency="USD" />
      </EventProvider>
    );

    expect(screen.getByText('USD 10,000')).toBeInTheDocument();
    expect(screen.getAllByText('USD 5,000').length).toBeGreaterThan(0);
    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getByText('Verified Quote')).toBeInTheDocument();
  });

  test('TaskManager renders task checklists and priorities', () => {
    const tasks: TaskItem[] = [
      { id: 't1', title: 'Book Florist', category: 'Decor', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Coordinator' },
      { id: 't2', title: 'Order Cake', category: 'Catering', duePhase: '1 Week Prior', status: 'To Do', priority: 'Medium', assignedTo: 'Host' },
    ];

    render(
      <EventProvider>
        <TaskManager tasks={tasks} />
      </EventProvider>
    );

    expect(screen.getByText('Milestone Checklist & Tasks')).toBeInTheDocument();
    expect(screen.getByText('Book Florist')).toBeInTheDocument();
    expect(screen.getByText('Order Cake')).toBeInTheDocument();
  });

  test('GuestManager renders guest directory and RSVP statuses', () => {
    const guests: GuestItem[] = [
      { id: 'g1', name: 'Eleanor Vance', category: 'VIP', rsvpStatus: 'Confirmed', dietary: 'Vegetarian', plusOne: true },
      { id: 'g2', name: 'Arthur Pendelton', category: 'Friends', rsvpStatus: 'Pending', dietary: 'Standard', plusOne: false },
    ];

    render(
      <EventProvider>
        <GuestManager guests={guests} />
      </EventProvider>
    );

    expect(screen.getByText('Guest List & RSVP Tracking')).toBeInTheDocument();
    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('Arthur Pendelton')).toBeInTheDocument();
  });
});
