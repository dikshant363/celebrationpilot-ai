import { GoogleGenAI } from '@google/genai';
import {
  EventBrief,
  GeneratedPlanSuite,
  EventConcept,
  DetailedEventPlan,
} from '../types/event';
import { generateMockPlanSuite } from './mockEventEngine';

// Candidate models in preference order: official Google Gemini models with fallback
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
];
const REQUEST_TIMEOUT_MS = 25000;

function buildEventPrompt(brief: EventBrief): string {
  return `
You are CelebrationPilot AI, an elite event architect and master celebration strategist.
Analyze the following EventBrief and generate a comprehensive, highly personalized, production-grade event planning suite.

Event Brief:
- Event Type: ${brief.eventType}
- Event Title: "${brief.eventTitle}"
- Target Date: ${brief.targetDate}
- Destination / City: ${brief.city}
- Preferred Venue Style: ${brief.venueType}
- Guest Count: ${brief.guestCount} attendees
- Budget: ${brief.currency} ${brief.budgetTotal.toLocaleString()}
- Theme / Aesthetic: ${brief.themePreference}
- Dietary Preferences: ${brief.dietaryRestrictions.join(', ') || 'Standard options'}
- Accessibility Requirements: ${brief.accessibilityRequirements.join(', ') || 'Standard ground access'}
- Priorities & Vibe: ${brief.vibeAndPriorities.join(', ') || 'Memorable experience'}
- Special Requests: ${brief.specialRequests || 'None'}

Requirements:
1. Generate exactly 3 distinct, creative, and feasible event concepts:
   - Concept 1: Opulent / Luxe (high-touch, elegant, priority on catering & presentation)
   - Concept 2: Organic Chic / Warm Intimacy (community, acoustic, sustainable)
   - Concept 3: Modern Minimalist / High-Tech (modern styling, upbeat, interactive social moments)
2. Each concept MUST strictly respect the hard constraints (Budget: ${brief.currency} ${brief.budgetTotal}, Guest Count: ${brief.guestCount}).
3. For each of the 3 concepts, provide a fully populated detailed plan including:
   - Minute-by-minute schedule (7-8 time slots)
   - Category budget breakdown (Allocated amounts summing to exactly or slightly under ${brief.budgetTotal})
   - Milestone checklist tasks (across 4 Weeks Prior, 2 Weeks Prior, 1 Week Prior, Day Of, Post-Event)
   - Representative guest list (7 guests with RSVP states and dietary tags)
   - Representative vendor directory (5 vendors with estimated & actual costs)

Return ONLY a valid, parseable JSON object matching this exact structure:
{
  "concepts": [
    {
      "id": "concept-1",
      "title": "string",
      "tagline": "string",
      "vibe": "string",
      "feasibilityScore": 95,
      "budgetEstimate": ${brief.budgetTotal},
      "categoryShares": {
        "venue": 0.30,
        "catering": 0.32,
        "decor": 0.15,
        "entertainment": 0.10,
        "photography": 0.06,
        "logistics": 0.04,
        "contingency": 0.03
      },
      "decorConcept": "string",
      "cateringSummary": {
        "style": "string",
        "perGuestEstimate": 50,
        "highlights": ["string", "string"]
      },
      "entertainmentHighlights": ["string", "string"],
      "whyThisWorks": "string",
      "tradeOffs": "string"
    }
  ],
  "selectedConceptId": "concept-1",
  "detailedPlans": {
    "concept-1": {
      "conceptId": "concept-1",
      "title": "string",
      "tagline": "string",
      "schedule": [
        { "time": "18:00", "title": "Guest Arrival", "description": "string", "lead": "Hospitality Lead" }
      ],
      "budgetBreakdown": [
        { "id": "c1-b1", "category": "Venue", "allocated": 3000, "spent": 1500, "notes": "string", "isVerifiedQuote": true }
      ],
      "tasks": [
        { "id": "c1-t1", "title": "Finalize venue contract", "category": "Venue", "duePhase": "4 Weeks Prior", "status": "Completed", "priority": "High", "assignedTo": "Coordinator" }
      ],
      "guestList": [
        { "id": "g-1", "name": "John Doe", "category": "VIP", "rsvpStatus": "Confirmed", "dietary": "None", "plusOne": true }
      ],
      "vendorDirectory": [
        { "id": "v-1", "name": "Grand Ballroom", "service": "Venue Rental", "estimatedCost": 3000, "actualCost": 3000, "status": "Booked", "contact": "info@venue.com" }
      ]
    }
  }
}
`;
}

async function executeModelInference(
  ai: GoogleGenAI,
  modelName: string,
  prompt: string,
  timeoutMs: number
): Promise<string> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Inference timed out after ${timeoutMs}ms on model ${modelName}`)), timeoutMs);
  });

  try {
    const apiPromise = ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    return response.text?.trim() || '';
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function validateAndRepairPlanSuite(
  parsed: unknown,
  brief: EventBrief
): GeneratedPlanSuite | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

  const rawObj = parsed as Record<string, unknown>;
  const rawConcepts = rawObj.concepts;
  if (!Array.isArray(rawConcepts) || rawConcepts.length < 3) return null;

  const fallbackSuite = generateMockPlanSuite(brief);

  const repairedConcepts: EventConcept[] = [];
  const repairedPlans: Record<string, DetailedEventPlan> = {};

  for (let i = 0; i < 3; i++) {
    const c = (rawConcepts[i] as Partial<EventConcept>) || {};
    const fallbackConcept = fallbackSuite.concepts[i];
    const conceptId = c.id || `concept-${i + 1}`;

    const repairedConcept: EventConcept = {
      id: conceptId,
      title: typeof c.title === 'string' && c.title.trim() ? c.title.trim() : fallbackConcept.title,
      tagline: typeof c.tagline === 'string' && c.tagline.trim() ? c.tagline.trim() : fallbackConcept.tagline,
      vibe: typeof c.vibe === 'string' && c.vibe.trim() ? c.vibe.trim() : fallbackConcept.vibe,
      feasibilityScore:
        typeof c.feasibilityScore === 'number' && c.feasibilityScore >= 50 && c.feasibilityScore <= 100
          ? Math.round(c.feasibilityScore)
          : fallbackConcept.feasibilityScore,
      budgetEstimate:
        typeof c.budgetEstimate === 'number' && c.budgetEstimate > 0
          ? Math.round(c.budgetEstimate)
          : fallbackConcept.budgetEstimate,
      categoryShares:
        c.categoryShares && typeof c.categoryShares === 'object'
          ? {
              venue: Number(c.categoryShares.venue) || fallbackConcept.categoryShares.venue,
              catering: Number(c.categoryShares.catering) || fallbackConcept.categoryShares.catering,
              decor: Number(c.categoryShares.decor) || fallbackConcept.categoryShares.decor,
              entertainment: Number(c.categoryShares.entertainment) || fallbackConcept.categoryShares.entertainment,
              photography: Number(c.categoryShares.photography) || fallbackConcept.categoryShares.photography,
              logistics: Number(c.categoryShares.logistics) || fallbackConcept.categoryShares.logistics,
              contingency: Number(c.categoryShares.contingency) || fallbackConcept.categoryShares.contingency,
            }
          : fallbackConcept.categoryShares,
      decorConcept: typeof c.decorConcept === 'string' && c.decorConcept.trim() ? c.decorConcept.trim() : fallbackConcept.decorConcept,
      cateringSummary: {
        style: c.cateringSummary?.style || fallbackConcept.cateringSummary.style,
        perGuestEstimate:
          Number(c.cateringSummary?.perGuestEstimate) || fallbackConcept.cateringSummary.perGuestEstimate,
        highlights:
          Array.isArray(c.cateringSummary?.highlights) && c.cateringSummary.highlights.length > 0
            ? c.cateringSummary.highlights.map(String)
            : fallbackConcept.cateringSummary.highlights,
      },
      entertainmentHighlights:
        Array.isArray(c.entertainmentHighlights) && c.entertainmentHighlights.length > 0
          ? c.entertainmentHighlights.map(String)
          : fallbackConcept.entertainmentHighlights,
      whyThisWorks: typeof c.whyThisWorks === 'string' ? c.whyThisWorks : fallbackConcept.whyThisWorks,
      tradeOffs: typeof c.tradeOffs === 'string' ? c.tradeOffs : fallbackConcept.tradeOffs,
    };
    repairedConcepts.push(repairedConcept);

    // Detailed plan validation
    const rawPlans = (rawObj.detailedPlans as Record<string, Partial<DetailedEventPlan>>) || {};
    const planCandidate = rawPlans[conceptId] || rawPlans[c.id || ''] || fallbackSuite.detailedPlans[fallbackConcept.id];

    repairedPlans[conceptId] = {
      conceptId,
      title: repairedConcept.title,
      tagline: repairedConcept.tagline,
      schedule:
        Array.isArray(planCandidate?.schedule) && planCandidate.schedule.length > 0
          ? planCandidate.schedule.map((s, idx) => ({
              time: s.time || `${18 + idx}:00`,
              title: s.title || `Milestone ${idx + 1}`,
              description: s.description || 'Operational execution',
              lead: s.lead || 'Event Coordinator',
            }))
          : fallbackSuite.detailedPlans[fallbackConcept.id].schedule,
      budgetBreakdown:
        Array.isArray(planCandidate?.budgetBreakdown) && planCandidate.budgetBreakdown.length > 0
          ? planCandidate.budgetBreakdown.map((b, idx) => ({
              id: b.id || `${conceptId}-b${idx + 1}`,
              category: b.category || 'Venue',
              allocated: Number(b.allocated) || 1000,
              spent: Number(b.spent) || 0,
              notes: b.notes || 'Allocated quota',
              isVerifiedQuote: Boolean(b.isVerifiedQuote),
            }))
          : fallbackSuite.detailedPlans[fallbackConcept.id].budgetBreakdown,
      tasks:
        Array.isArray(planCandidate?.tasks) && planCandidate.tasks.length > 0
          ? planCandidate.tasks.map((t, idx) => ({
              id: t.id || `${conceptId}-t${idx + 1}`,
              title: t.title || `Task ${idx + 1}`,
              category: t.category || 'General',
              duePhase: t.duePhase || '1 Week Prior',
              status: t.status || 'To Do',
              priority: t.priority || 'Medium',
              assignedTo: t.assignedTo || 'Coordinator',
            }))
          : fallbackSuite.detailedPlans[fallbackConcept.id].tasks,
      guestList:
        Array.isArray(planCandidate?.guestList) && planCandidate.guestList.length > 0
          ? planCandidate.guestList.map((g, idx) => ({
              id: g.id || `g-${idx + 1}`,
              name: g.name || `Guest ${idx + 1}`,
              category: g.category || 'Friends',
              rsvpStatus: g.rsvpStatus || 'Pending',
              dietary: g.dietary || 'Standard',
              plusOne: Boolean(g.plusOne),
            }))
          : fallbackSuite.detailedPlans[fallbackConcept.id].guestList,
      vendorDirectory:
        Array.isArray(planCandidate?.vendorDirectory) && planCandidate.vendorDirectory.length > 0
          ? planCandidate.vendorDirectory.map((v, idx) => ({
              id: v.id || `v-${idx + 1}`,
              name: v.name || `Vendor ${idx + 1}`,
              service: v.service || 'Service',
              estimatedCost: Number(v.estimatedCost) || 500,
              actualCost: v.actualCost !== undefined && v.actualCost !== null ? Number(v.actualCost) : null,
              status: v.status || 'Proposed',
              contact: v.contact || 'contact@celebration.local',
            }))
          : fallbackSuite.detailedPlans[fallbackConcept.id].vendorDirectory,
    };
  }

  const selectedConceptId =
    typeof rawObj.selectedConceptId === 'string' && repairedPlans[rawObj.selectedConceptId]
      ? rawObj.selectedConceptId
      : repairedConcepts[0].id;

  return {
    brief,
    concepts: repairedConcepts,
    selectedConceptId,
    detailedPlans: repairedPlans,
    generatedAt: new Date().toISOString(),
    isFallback: false,
  };
}

function cleanAndParseJson(rawText: string, brief: EventBrief): GeneratedPlanSuite | null {
  if (!rawText) return null;

  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleanText) as Record<string, unknown>;
    return validateAndRepairPlanSuite(parsed, brief);
  } catch {
    return null;
  }
}

export async function generateEventPlanWithGemini(
  brief: EventBrief,
  customApiKey?: string
): Promise<GeneratedPlanSuite> {
  if (process.env.E2E_MOCK_AI === 'true') {
    return generateMockPlanSuite(brief);
  }

  const apiKey =
    customApiKey && customApiKey.trim().length > 10
      ? customApiKey.trim()
      : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return generateMockPlanSuite(brief);
  }

  const prompt = buildEventPrompt(brief);

  try {
    const ai = new GoogleGenAI({ apiKey });

    for (const model of CANDIDATE_MODELS) {
      try {
        const rawJsonText = await executeModelInference(ai, model, prompt, REQUEST_TIMEOUT_MS);
        const parsed = cleanAndParseJson(rawJsonText, brief);

        if (parsed) {
          return parsed;
        }

        console.warn(`[Celebration AI] Model ${model} returned unparseable or incomplete JSON. Trying next candidate.`);
      } catch (err) {
        console.warn(`[Celebration AI] Model ${model} inference failed or timed out. Trying next candidate.`, (err as Error)?.message || err);
      }
    }
  } catch (initErr) {
    console.warn('[Celebration AI] Initialization failure. Using deterministic fallback.', initErr);
  }

  return generateMockPlanSuite(brief);
}
