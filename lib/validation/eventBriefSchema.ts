import { EventBrief, EventType, Currency, VenueType } from '../types/event';

export const VALID_EVENT_TYPES: EventType[] = [
  'Birthday',
  'Wedding',
  'Anniversary',
  'Graduation',
  'Cultural',
  'Corporate',
  'Custom',
];

export const VALID_CURRENCIES: Currency[] = ['USD', 'INR', 'EUR', 'GBP'];

export const VALID_VENUE_TYPES: VenueType[] = [
  'Indoor Banquet',
  'Outdoor Garden',
  'Beachfront',
  'Rooftop',
  'Home / Backyard',
  'Community Hall',
];

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized?: EventBrief;
}

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    // Strip HTML brackets and control characters
    .replace(/[\x00-\x1F\x7F<>]/g, '')
    .trim();
}

export function validateCustomApiKey(key?: unknown): { isValid: boolean; sanitized?: string; error?: string } {
  if (!key || typeof key !== 'string') {
    return { isValid: true, sanitized: undefined };
  }
  const trimmed = key.trim();
  if (trimmed === '') {
    return { isValid: true, sanitized: undefined };
  }
  // Google AI Studio API keys are typically 39-60 alphanumeric characters with dashes/underscores
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid API key format. Expected 20-128 alphanumeric characters with dashes or underscores.',
    };
  }
  return { isValid: true, sanitized: trimmed };
}

export function validateEventBrief(raw: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!raw || typeof raw !== 'object') {
    return { isValid: false, errors: { form: 'Event brief data must be an object' } };
  }

  const data = raw as Record<string, unknown>;

  // eventType
  const eventType = data.eventType as EventType;
  if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
    errors.eventType = `Please select a valid event type (${VALID_EVENT_TYPES.join(', ')})`;
  }

  // eventTitle
  const eventTitle = sanitizeText(data.eventTitle);
  if (!eventTitle || eventTitle.length < 3) {
    errors.eventTitle = 'Event title must be at least 3 characters long';
  } else if (eventTitle.length > 100) {
    errors.eventTitle = 'Event title cannot exceed 100 characters';
  }

  // targetDate
  const targetDateStr = sanitizeText(data.targetDate);
  if (!targetDateStr) {
    errors.targetDate = 'Please select a valid celebration date';
  } else {
    const parsedDate = new Date(targetDateStr);
    if (isNaN(parsedDate.getTime())) {
      errors.targetDate = 'Target date must be a valid calendar date (YYYY-MM-DD)';
    }
  }

  // city
  const city = sanitizeText(data.city);
  if (!city || city.length < 2) {
    errors.city = 'City / destination must be at least 2 characters';
  } else if (city.length > 80) {
    errors.city = 'City cannot exceed 80 characters';
  }

  // venueType
  const venueType = data.venueType as VenueType;
  if (!venueType || !VALID_VENUE_TYPES.includes(venueType)) {
    errors.venueType = `Please choose a valid venue preference`;
  }

  // guestCount
  const rawGuests = Number(data.guestCount);
  if (isNaN(rawGuests) || !Number.isInteger(rawGuests) || rawGuests < 2) {
    errors.guestCount = 'Guest count must be at least 2 attendees';
  } else if (rawGuests > 25000) {
    errors.guestCount = 'Guest count cannot exceed 25,000 for standard automated logistics';
  }

  // budgetTotal
  const rawBudget = Number(data.budgetTotal);
  if (isNaN(rawBudget) || rawBudget < 100) {
    errors.budgetTotal = 'Total budget must be at least 100 in your selected currency';
  } else if (rawBudget > 50000000) {
    errors.budgetTotal = 'Budget cannot exceed 50,000,000';
  }

  // currency
  const currency = data.currency as Currency;
  if (!currency || !VALID_CURRENCIES.includes(currency)) {
    errors.currency = `Currency must be one of: ${VALID_CURRENCIES.join(', ')}`;
  }

  // themePreference
  const themePreference = sanitizeText(data.themePreference);
  if (!themePreference) {
    errors.themePreference = 'Please specify a preferred theme or stylistic aesthetic';
  } else if (themePreference.length > 120) {
    errors.themePreference = 'Theme preference cannot exceed 120 characters';
  }

  // arrays
  const dietaryRestrictions = Array.isArray(data.dietaryRestrictions)
    ? data.dietaryRestrictions
        .map(sanitizeText)
        .filter((t) => t.length > 0 && t.length <= 50)
        .slice(0, 20)
    : [];

  const accessibilityRequirements = Array.isArray(data.accessibilityRequirements)
    ? data.accessibilityRequirements
        .map(sanitizeText)
        .filter((t) => t.length > 0 && t.length <= 60)
        .slice(0, 20)
    : [];

  const vibeAndPriorities = Array.isArray(data.vibeAndPriorities)
    ? data.vibeAndPriorities
        .map(sanitizeText)
        .filter((t) => t.length > 0 && t.length <= 60)
        .slice(0, 20)
    : [];

  const specialRequests = sanitizeText(data.specialRequests).slice(0, 1000);

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: isValid
      ? {
          eventType,
          eventTitle,
          targetDate: targetDateStr,
          city,
          venueType,
          guestCount: rawGuests,
          budgetTotal: rawBudget,
          currency,
          themePreference,
          dietaryRestrictions,
          accessibilityRequirements,
          vibeAndPriorities,
          specialRequests,
        }
      : undefined,
  };
}
