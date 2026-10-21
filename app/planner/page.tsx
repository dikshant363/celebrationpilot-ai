'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { useEvent } from '@/lib/context/EventContext';
import {
  EventBrief,
  EventType,
  Currency,
  VenueType,
} from '@/lib/types/event';
import { validateEventBrief } from '@/lib/validation/eventBriefSchema';
import { PlannerStepFundamentals } from '@/components/planner/PlannerStepFundamentals';
import { PlannerStepConstraints } from '@/components/planner/PlannerStepConstraints';
import { PlannerStepAesthetics } from '@/components/planner/PlannerStepAesthetics';

const STEP_LABELS = ['Event Fundamentals', 'Venue & Constraints', 'Aesthetic & Hospitality'];

export default function PlannerPage() {
  const router = useRouter();
  const { brief, generatePlan, isGenerating } = useEvent();

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [eventType, setEventType] = useState<EventType>(brief?.eventType || 'Birthday');
  const [eventTitle, setEventTitle] = useState(brief?.eventTitle || '');
  const [targetDate, setTargetDate] = useState(brief?.targetDate || '2026-11-15');
  const [city, setCity] = useState(brief?.city || 'San Francisco, CA');

  const [venueType, setVenueType] = useState<VenueType>(brief?.venueType || 'Outdoor Garden');
  const [guestCount, setGuestCount] = useState<number>(brief?.guestCount || 75);
  const [budgetTotal, setBudgetTotal] = useState<number>(brief?.budgetTotal || 12000);
  const [currency, setCurrency] = useState<Currency>(brief?.currency || 'USD');

  const [themePreference, setThemePreference] = useState(
    brief?.themePreference || 'Modern Botanical Chic'
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    brief?.dietaryRestrictions || ['Vegetarian', 'Gluten-Free']
  );
  const [accessibilityRequirements, setAccessibilityRequirements] = useState<string[]>(
    brief?.accessibilityRequirements || ['Wheelchair Ramp Access']
  );
  const [vibeAndPriorities, setVibeAndPriorities] = useState<string[]>(
    brief?.vibeAndPriorities || ['Intimate Acoustic Vibes', 'Interactive Chef Stations']
  );
  const [specialRequests, setSpecialRequests] = useState(brief?.specialRequests || '');

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!eventTitle.trim() || eventTitle.length < 3) {
        newErrors.eventTitle = 'Event title must be at least 3 characters.';
      }
      if (!targetDate) {
        newErrors.targetDate = 'Please select a target celebration date.';
      }
      if (!city.trim() || city.length < 2) {
        newErrors.city = 'Please enter a valid city or destination.';
      }
    } else if (step === 2) {
      if (!guestCount || guestCount < 2) {
        newErrors.guestCount = 'Guest count must be at least 2 attendees.';
      }
      if (!budgetTotal || budgetTotal < 100) {
        newErrors.budgetTotal = 'Total budget must be at least 100.';
      }
    } else if (step === 3) {
      if (!themePreference.trim()) {
        newErrors.themePreference = 'Please describe your aesthetic or theme preference.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !validateCurrentStep()) return;

    const briefPayload: EventBrief = {
      eventType,
      eventTitle: eventTitle.trim(),
      targetDate,
      city: city.trim(),
      venueType,
      guestCount: Number(guestCount),
      budgetTotal: Number(budgetTotal),
      currency,
      themePreference: themePreference.trim(),
      dietaryRestrictions,
      accessibilityRequirements,
      vibeAndPriorities,
      specialRequests: specialRequests.trim(),
    };

    const validation = validateEventBrief(briefPayload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const success = await generatePlan(briefPayload);
    if (success) {
      router.push('/concepts');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
          Celebration Brief Wizard
        </h1>
        <p className="text-sm text-[#555555] mt-1.5">
          Enter your celebration constraints to generate 3 tailored concepts and master run of show.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-[#d2d2d7] rounded-2xl p-5 mb-8 shadow-xs">
        <ProgressIndicator currentStep={step} totalSteps={3} stepLabels={STEP_LABELS} />
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <PlannerStepFundamentals
            eventType={eventType}
            setEventType={setEventType}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            city={city}
            setCity={setCity}
            errors={errors}
          />
        )}

        {step === 2 && (
          <PlannerStepConstraints
            venueType={venueType}
            setVenueType={setVenueType}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
            budgetTotal={budgetTotal}
            setBudgetTotal={setBudgetTotal}
            currency={currency}
            setCurrency={setCurrency}
            errors={errors}
          />
        )}

        {step === 3 && (
          <PlannerStepAesthetics
            themePreference={themePreference}
            setThemePreference={setThemePreference}
            dietaryRestrictions={dietaryRestrictions}
            setDietaryRestrictions={setDietaryRestrictions}
            accessibilityRequirements={accessibilityRequirements}
            setAccessibilityRequirements={setAccessibilityRequirements}
            vibeAndPriorities={vibeAndPriorities}
            setVibeAndPriorities={setVibeAndPriorities}
            specialRequests={specialRequests}
            setSpecialRequests={setSpecialRequests}
            errors={errors}
          />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={handleBack} disabled={isGenerating}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" variant="primary" onClick={handleNext}>
              Next Step
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              data-testid="generate-plan-button"
              aria-label="Generate 3 Celebration Concepts"
              onClick={handleSubmit}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate 3 Celebration Concepts
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
