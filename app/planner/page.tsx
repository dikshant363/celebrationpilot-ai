'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { useEvent } from '@/lib/context/EventContext';
import {
  EventBrief,
  EventType,
  Currency,
  VenueType,
} from '@/lib/types/event';
import {
  VALID_EVENT_TYPES,
  VALID_CURRENCIES,
  VALID_VENUE_TYPES,
  validateEventBrief,
} from '@/lib/validation/eventBriefSchema';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Nut Allergies',
  'Dairy-Free',
];

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair Ramp Access',
  'Ground Floor Seating',
  'Quiet / Low-Sensory Zone',
  'Assisted Listening Device',
  'Service Animal Friendly',
];

const VIBE_OPTIONS = [
  'High-Energy Live Band',
  'Intimate Acoustic Vibes',
  'Interactive Chef Stations',
  'Plated Fine Dining',
  'Social 360 Video Booth',
  'Eco-Friendly Zero-Waste',
  'Starlight Garden Ambience',
  'Late-Night Dance Party',
];

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

  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

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

  const stepLabels = ['Event Fundamentals', 'Venue & Constraints', 'Aesthetic & Hospitality'];

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
        <ProgressIndicator currentStep={step} totalSteps={3} stepLabels={stepLabels} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: EVENT FUNDAMENTALS */}
        {step === 1 && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1d1d1f]">Step 1: Event Fundamentals</h2>
              <p className="text-xs text-[#555555]">Select the celebration type and basic parameters</p>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Celebration Type
              </label>
              <div className="flex flex-wrap gap-2">
                {VALID_EVENT_TYPES.map((type) => (
                  <Chip
                    key={type}
                    selected={eventType === type}
                    onClick={() => setEventType(type)}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Event Title */}
            <Input
              label="Event Title / Celebration Name"
              placeholder="e.g. Maya & Leo's Vineyard Wedding, 30th Rooftop Soirée"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              error={errors.eventTitle}
              helper="A memorable working title for your celebration dossier"
            />

            {/* Date and City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                error={errors.targetDate}
              />
              <Input
                label="City / Destination"
                placeholder="e.g. San Francisco, CA or Paris, France"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
              />
            </div>
          </Card>
        )}

        {/* STEP 2: VENUE & CONSTRAINTS */}
        {step === 2 && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1d1d1f]">Step 2: Venue & Hard Constraints</h2>
              <p className="text-xs text-[#555555]">
                Establish realistic boundaries for venue selection, headcount, and financial envelope
              </p>
            </div>

            {/* Venue Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Preferred Venue Style
              </label>
              <div className="flex flex-wrap gap-2">
                {VALID_VENUE_TYPES.map((v) => (
                  <Chip key={v} selected={venueType === v} onClick={() => setVenueType(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Expected Guest Count"
                type="number"
                min={2}
                max={25000}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                error={errors.guestCount}
                helper="Adults and verified attendees"
              />

              <div className="sm:col-span-2 grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    label="Total Budget"
                    type="number"
                    min={100}
                    value={budgetTotal}
                    onChange={(e) => setBudgetTotal(Number(e.target.value))}
                    error={errors.budgetTotal}
                    helper="Overall financial allocation"
                  />
                </div>
                <div>
                  <label htmlFor="currency-select" className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase mb-1.5">
                    Currency
                  </label>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  >
                    {VALID_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Estimated Per Guest Banner */}
            <div className="p-3.5 bg-[#f5f5f7] rounded-xl text-xs text-[#555555] flex items-center justify-between">
              <span>Estimated Per-Guest Allocation Envelope:</span>
              <span className="font-bold text-[#1d1d1f]">
                {currency} {guestCount > 0 ? Math.round(budgetTotal / guestCount).toLocaleString() : 0} / person
              </span>
            </div>
          </Card>
        )}

        {/* STEP 3: AESTHETIC & HOSPITALITY */}
        {step === 3 && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1d1d1f]">Step 3: Aesthetic, Dietary & Priorities</h2>
              <p className="text-xs text-[#555555]">
                Fine-tune culinary curation, sensory ambience, and special guest accommodations
              </p>
            </div>

            {/* Theme / Aesthetic */}
            <Input
              label="Theme & Styling Aesthetic"
              placeholder="e.g. Modern Minimalist, Bohemian Rustic, Cyberpunk Neon, Regal Royalty"
              value={themePreference}
              onChange={(e) => setThemePreference(e.target.value)}
              error={errors.themePreference}
              helper="The artistic direction for floral, table styling, and lighting"
            />

            {/* Dietary Needs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Dietary Accommodations
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((item) => (
                  <Chip
                    key={item}
                    selected={dietaryRestrictions.includes(item)}
                    onClick={() =>
                      toggleArrayItem(dietaryRestrictions, item, setDietaryRestrictions)
                    }
                  >
                    {item}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Accessibility Requirements */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Accessibility & Inclusivity
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCESSIBILITY_OPTIONS.map((item) => (
                  <Chip
                    key={item}
                    selected={accessibilityRequirements.includes(item)}
                    onClick={() =>
                      toggleArrayItem(
                        accessibilityRequirements,
                        item,
                        setAccessibilityRequirements
                      )
                    }
                  >
                    {item}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Priorities & Vibe */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Key Entertainment & Vibe Priorities
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((item) => (
                  <Chip
                    key={item}
                    selected={vibeAndPriorities.includes(item)}
                    onClick={() =>
                      toggleArrayItem(vibeAndPriorities, item, setVibeAndPriorities)
                    }
                  >
                    {item}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label htmlFor="special-requests-input" className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
                Special Requests & Notes (Optional)
              </label>
              <textarea
                id="special-requests-input"
                rows={3}
                placeholder="Any special family traditions, surprise performances, or strict curfew requirements..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
          </Card>
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
