import { GoogleGenAI } from '@google/genai';
import { EventBrief, GeneratedPlanSuite } from '../types/event';
import { generateMockPlanSuite } from './mockEventEngine';

const PRIMARY_MODEL = 'gemini-3.8-flash';
const SECONDARY_MODEL = 'gemini-3.5-flash';
const TERTIARY_MODEL = 'gemini-3.5-flash-lite';
const REQUEST_TIMEOUT_MS = 20000;

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

function cleanAndParseJson(rawText: string, brief: EventBrief): GeneratedPlanSuite | null {
  if (!rawText) return null;

  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleanText) as Partial<GeneratedPlanSuite>;
    if (
      !Array.isArray(parsed.concepts) ||
      parsed.concepts.length < 3 ||
      !parsed.detailedPlans ||
      typeof parsed.detailedPlans !== 'object'
    ) {
      return null;
    }

    return {
      brief,
      concepts: parsed.concepts,
      selectedConceptId: parsed.selectedConceptId || parsed.concepts[0]?.id || 'concept-1',
      detailedPlans: parsed.detailedPlans,
      generatedAt: new Date().toISOString(),
      isFallback: false,
    };
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

  const apiKey = (customApiKey && customApiKey.trim().length > 10)
    ? customApiKey.trim()
    : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return generateMockPlanSuite(brief);
  }

  const prompt = buildEventPrompt(brief);
  const modelsToTry = [PRIMARY_MODEL, SECONDARY_MODEL, TERTIARY_MODEL];

  try {
    const ai = new GoogleGenAI({ apiKey });

    for (const model of modelsToTry) {
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
