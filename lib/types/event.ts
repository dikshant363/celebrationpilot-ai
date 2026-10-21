export type EventType =
  | 'Birthday'
  | 'Wedding'
  | 'Anniversary'
  | 'Graduation'
  | 'Cultural'
  | 'Corporate'
  | 'Custom';

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export type VenueType =
  | 'Indoor Banquet'
  | 'Outdoor Garden'
  | 'Beachfront'
  | 'Rooftop'
  | 'Home / Backyard'
  | 'Community Hall';

export interface EventBrief {
  eventType: EventType;
  eventTitle: string;
  targetDate: string; // YYYY-MM-DD
  city: string;
  venueType: VenueType;
  guestCount: number;
  budgetTotal: number;
  currency: Currency;
  themePreference: string;
  dietaryRestrictions: string[];
  accessibilityRequirements: string[];
  vibeAndPriorities: string[];
  specialRequests?: string;
}

export interface BudgetCategoryShare {
  venue: number;
  catering: number;
  decor: number;
  entertainment: number;
  photography: number;
  logistics: number;
  contingency: number;
}

export interface EventConcept {
  id: string; // 'concept-1' | 'concept-2' | 'concept-3'
  title: string;
  tagline: string;
  vibe: string;
  feasibilityScore: number;
  budgetEstimate: number;
  categoryShares: BudgetCategoryShare;
  decorConcept: string;
  cateringSummary: {
    style: string;
    perGuestEstimate: number;
    highlights: string[];
  };
  entertainmentHighlights: string[];
  whyThisWorks: string;
  tradeOffs: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  lead: string;
}

export type BudgetCategory =
  | 'Venue'
  | 'Catering'
  | 'Decor & Styling'
  | 'Entertainment & Sound'
  | 'Photography & Media'
  | 'Logistics & Rentals'
  | 'Contingency';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  allocated: number;
  spent: number;
  notes: string;
  isVerifiedQuote: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  duePhase: '4 Weeks Prior' | '2 Weeks Prior' | '1 Week Prior' | 'Day Of' | 'Post-Event';
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
}

export type GuestCategory = 'Family' | 'Friends' | 'VIP' | 'Colleagues' | 'Plus-One';
export type RSVPStatus = 'Confirmed' | 'Pending' | 'Declined';

export interface GuestItem {
  id: string;
  name: string;
  category: GuestCategory;
  rsvpStatus: RSVPStatus;
  dietary: string;
  plusOne: boolean;
}

export type VendorStatus = 'Proposed' | 'Contacted' | 'Quoted' | 'Booked';

export interface VendorItem {
  id: string;
  name: string;
  service: string;
  estimatedCost: number;
  actualCost: number | null;
  status: VendorStatus;
  contact: string;
}

export interface DetailedEventPlan {
  conceptId: string;
  title: string;
  tagline: string;
  schedule: ScheduleItem[];
  budgetBreakdown: BudgetItem[];
  tasks: TaskItem[];
  guestList: GuestItem[];
  vendorDirectory: VendorItem[];
}

export interface GeneratedPlanSuite {
  brief: EventBrief;
  concepts: EventConcept[]; // Exactly 3 distinct concepts
  selectedConceptId: string;
  detailedPlans: Record<string, DetailedEventPlan>; // keyed by conceptId
  generatedAt: string;
  isFallback: boolean;
}

export interface BudgetMetrics {
  totalBudget: number;
  totalAllocated: number;
  totalSpent: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  perGuestCost: number;
  verifiedQuotePercentage: number;
  verdict: 'Optimal' | 'Tight' | 'Over Budget';
}
