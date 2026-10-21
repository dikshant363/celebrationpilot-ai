import React from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { EventType } from '@/lib/types/event';
import { VALID_EVENT_TYPES } from '@/lib/validation/eventBriefSchema';

interface PlannerStepFundamentalsProps {
  eventType: EventType;
  setEventType: (val: EventType) => void;
  eventTitle: string;
  setEventTitle: (val: string) => void;
  targetDate: string;
  setTargetDate: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  errors: Record<string, string>;
}

export const PlannerStepFundamentals: React.FC<PlannerStepFundamentalsProps> = ({
  eventType,
  setEventType,
  eventTitle,
  setEventTitle,
  targetDate,
  setTargetDate,
  city,
  setCity,
  errors,
}) => {
  return (
    <Card className="space-y-6 p-6 sm:p-8 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
      <div className="border-b border-[#e5e5ea] pb-4">
        <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Step 1: Event Fundamentals</h2>
        <p className="text-xs text-[#555555] mt-1">Select your celebration milestone and core parameters</p>
      </div>

      {/* Event Type */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-[#1d1d1f] tracking-wider uppercase">
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
  );
};
