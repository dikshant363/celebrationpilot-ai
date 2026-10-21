import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlannerStepFundamentals } from '@/components/planner/PlannerStepFundamentals';
import { PlannerStepConstraints } from '@/components/planner/PlannerStepConstraints';
import { PlannerStepAesthetics } from '@/components/planner/PlannerStepAesthetics';

describe('Component: Planner Wizard Step Components', () => {
  test('PlannerStepFundamentals renders fields and handles input changes', () => {
    const setEventType = vi.fn();
    const setEventTitle = vi.fn();
    const setTargetDate = vi.fn();
    const setCity = vi.fn();

    render(
      <PlannerStepFundamentals
        eventType="Birthday"
        setEventType={setEventType}
        eventTitle="Golden Gala"
        setEventTitle={setEventTitle}
        targetDate="2026-12-01"
        setTargetDate={setTargetDate}
        city="San Francisco, CA"
        setCity={setCity}
        errors={{ eventTitle: 'Title too short' }}
      />
    );

    expect(screen.getByText('Step 1: Event Fundamentals')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Golden Gala')).toBeInTheDocument();
    expect(screen.getByText('Title too short')).toBeInTheDocument();

    // Select Wedding
    fireEvent.click(screen.getByText('Wedding'));
    expect(setEventType).toHaveBeenCalledWith('Wedding');

    // Change title
    fireEvent.change(screen.getByDisplayValue('Golden Gala'), {
      target: { value: 'New Gala Title' },
    });
    expect(setEventTitle).toHaveBeenCalledWith('New Gala Title');
  });

  test('PlannerStepConstraints renders venue chips, guest count, and calculates per-guest cost', () => {
    const setVenueType = vi.fn();
    const setGuestCount = vi.fn();
    const setBudgetTotal = vi.fn();
    const setCurrency = vi.fn();

    render(
      <PlannerStepConstraints
        venueType="Outdoor Garden"
        setVenueType={setVenueType}
        guestCount={100}
        setGuestCount={setGuestCount}
        budgetTotal={20000}
        setBudgetTotal={setBudgetTotal}
        currency="USD"
        setCurrency={setCurrency}
        errors={{}}
      />
    );

    expect(screen.getByText('Step 2: Venue & Hard Constraints')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20000')).toBeInTheDocument();
    expect(screen.getByText('USD 200 / person')).toBeInTheDocument();

    // Select Indoor Banquet
    fireEvent.click(screen.getByText('Indoor Banquet'));
    expect(setVenueType).toHaveBeenCalledWith('Indoor Banquet');
  });

  test('PlannerStepAesthetics toggles dietary and priority chips', () => {
    const setThemePreference = vi.fn();
    const setDietaryRestrictions = vi.fn();
    const setAccessibilityRequirements = vi.fn();
    const setVibeAndPriorities = vi.fn();
    const setSpecialRequests = vi.fn();

    render(
      <PlannerStepAesthetics
        themePreference="Boho Minimalist"
        setThemePreference={setThemePreference}
        dietaryRestrictions={['Vegetarian']}
        setDietaryRestrictions={setDietaryRestrictions}
        accessibilityRequirements={['Wheelchair Ramp Access']}
        setAccessibilityRequirements={setAccessibilityRequirements}
        vibeAndPriorities={['Intimate Acoustic Vibes']}
        setVibeAndPriorities={setVibeAndPriorities}
        specialRequests=""
        setSpecialRequests={setSpecialRequests}
        errors={{}}
      />
    );

    expect(screen.getByText('Step 3: Aesthetic, Dietary & Priorities')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Boho Minimalist')).toBeInTheDocument();

    // Toggle Vegan on
    fireEvent.click(screen.getByText('Vegan'));
    expect(setDietaryRestrictions).toHaveBeenCalledWith(['Vegetarian', 'Vegan']);

    // Toggle Vegetarian off
    fireEvent.click(screen.getByText('Vegetarian'));
    expect(setDietaryRestrictions).toHaveBeenCalledWith([]);
  });
});
