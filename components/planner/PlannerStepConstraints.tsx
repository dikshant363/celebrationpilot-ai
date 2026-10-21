import React from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Currency, VenueType } from '@/lib/types/event';
import { VALID_CURRENCIES, VALID_VENUE_TYPES } from '@/lib/validation/eventBriefSchema';

interface PlannerStepConstraintsProps {
  venueType: VenueType;
  setVenueType: (val: VenueType) => void;
  guestCount: number;
  setGuestCount: (val: number) => void;
  budgetTotal: number;
  setBudgetTotal: (val: number) => void;
  currency: Currency;
  setCurrency: (val: Currency) => void;
  errors: Record<string, string>;
}

export const PlannerStepConstraints: React.FC<PlannerStepConstraintsProps> = ({
  venueType,
  setVenueType,
  guestCount,
  setGuestCount,
  budgetTotal,
  setBudgetTotal,
  currency,
  setCurrency,
  errors,
}) => {
  return (
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

      {/* Guest Count & Budget */}
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
            <label
              htmlFor="currency-select"
              className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase mb-1.5"
            >
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
  );
};
