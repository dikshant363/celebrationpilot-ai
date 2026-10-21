import React from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';

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

interface PlannerStepAestheticsProps {
  themePreference: string;
  setThemePreference: (val: string) => void;
  dietaryRestrictions: string[];
  setDietaryRestrictions: (val: string[]) => void;
  accessibilityRequirements: string[];
  setAccessibilityRequirements: (val: string[]) => void;
  vibeAndPriorities: string[];
  setVibeAndPriorities: (val: string[]) => void;
  specialRequests: string;
  setSpecialRequests: (val: string) => void;
  errors: Record<string, string>;
}

export const PlannerStepAesthetics: React.FC<PlannerStepAestheticsProps> = ({
  themePreference,
  setThemePreference,
  dietaryRestrictions,
  setDietaryRestrictions,
  accessibilityRequirements,
  setAccessibilityRequirements,
  vibeAndPriorities,
  setVibeAndPriorities,
  specialRequests,
  setSpecialRequests,
  errors,
}) => {
  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
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
        <label
          htmlFor="special-requests-input"
          className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase"
        >
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
  );
};
