# CelebrationPilot AI — Architectural Event & Celebration Studio

> **Hack2Skill Challenge 5 — AI-Powered Celebration & Event Planner**  
> An autonomous workstation that transforms event briefs into three feasible, tailored celebration concepts with minute-by-minute schedules, deterministic budgets, vendor contracts, guest RSVP tracking, and printable PDF dossiers.

**Live Deployment:** [https://celebrationpilot-ai.vercel.app/](https://celebrationpilot-ai.vercel.app/)  
**Source Code:** [https://github.com/dikshant363/celebrationpilot-ai](https://github.com/dikshant363/celebrationpilot-ai)

---

## 🌟 Overview & Mission

Planning major celebrations—whether milestone birthdays, weddings, anniversary galas, graduations, or corporate banquets—often suffers from fragmented spreadsheets, unrealistic vendor estimates, budget overruns, and disorganized day-of timelines.

**CelebrationPilot AI** solves this by providing:
1. **Multi-Constraint Event Brief Wizard**: Captures celebration type, hard budget, guest count, venue preferences, dietary restrictions, accessibility requirements, and entertainment vibes with client- and server-side schema validation.
2. **Three Meaningfully Different Archetype Concepts**:
   - **Opulent Luxe**: High-touch, fine-dining, ambient spotlighting, and seamless VIP hospitality.
   - **Boho-Chic Botanical**: Warm intimacy, acoustic soundscapes, grazing stations, and sustainable eco-decor.
   - **Futuristic Neon Horizon**: Modern minimalist, 360-degree video capture, and high-energy electronic soundscapes.
   *(Each tailored to the celebration domain: Weddings include ceremony & vow timelines, Corporate includes keynotes & breakout tracks, Birthdays include milestone toasts).*
3. **Deterministic Budget Engine & Overrun Detection**: Categorical allocation across venue, catering, decor, entertainment, media, and contingency. Distinguishes preliminary estimates from verified vendor quotes with real-time reactive deficit warnings.
4. **Minute-by-Minute Run of Show**: Real-time milestone timeline assigning designated operational leads for arrivals, keynote toasts, culinary service, and cloisters, with interactive custom milestone creation.
5. **Interactive Milestone Tasks & Guest Registry**: Pre-celebration countdown tasks (4 Weeks Prior $\rightarrow$ Day Of) with status toggling, and interactive RSVP management with dietary accommodations and plus-one seating.
6. **Supplier & Vendor Directory**: Tracks quoted vs. actual negotiated supplier contracts, booking statuses, and direct liaison communications.
7. **Printable Event Master Dossier & PDF Export**: Instant generation of standardized print-ready dossiers with strict HTML entity sanitization for on-site venue managers, caterers, and decorators.
8. **BYO Gemini API Key**: Users can supply their personal Google AI Studio key via an accessible modal, stored in browser local storage and forwarded via secure HTTPS headers.

---

## 📐 Architecture & Security Boundary

```
 USER
  ↓
EVENT BRIEF WIZARD (Strict Schema Validation, Boundaries & Sanitization)
  ↓
RATE LIMITER & SECURITY GATEWAY (Sliding-Window IP Throttling, Max 32KB Payload)
  ↓
GEMINI AI GATEWAY (gemini-2.5-flash → gemini-2.0-flash → gemini-1.5-flash → gemini-2.5-pro → gemini-1.5-pro)
  ↓ [Automatic Schema Repair & Graceful Fallback on Network / Rate Limits]
DOMAIN CELEBRATION DECISION ENGINE (Wedding, Corporate, Birthday, Gala)
  ↓
THREE FEASIBLE CELEBRATION ARCHETYPES
  ↓
WORKSPACE COMMAND CENTER (Schedule, Budget Math, Tasks, Guests, Vendors)
  ↓
SYNCHRONIZED LOCAL PERSISTENCE (useSyncExternalStore + LocalStorage)
  ↓
PRINTABLE EVENT DOSSIER & PDF EXPORT (XSS-Safe HTML Generation)
```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.3.4 (App Router & Turbopack)](https://nextjs.org/)
- **UI & State**: React 19, Tailwind CSS v4, Lucide React, `useSyncExternalStore`
- **GenAI Engine**: `@google/genai` (Google Gemini official production models: Gemini 2.5 Flash, 2.0 Flash, 1.5 Flash, 2.5 Pro, 1.5 Pro)
- **Security**: In-memory sliding-window rate limiting, HTTP security headers (CSP, HSTS, X-Frame-Options), strict key format validation, and output entity escaping
- **Accessibility**: WCAG 2.2 AA compliant contrast, ARIA tablist/tab controls, error alerts, and progressbar semantics
- **Unit & Component Testing**: Vitest 5.0, JSDOM, Testing Library
- **End-to-End Testing**: Playwright 1.63
- **Type Checking**: TypeScript 5 Strict Mode
- **Linting**: ESLint 9

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### 2. Installation
```bash
git clone https://github.com/dikshant363/celebrationpilot-ai.git
cd celebrationpilot-ai
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY="your_api_key_here"
```
*(Note: If no API key is provided, CelebrationPilot AI automatically activates its deterministic fallback engine with 100% operational fidelity).*

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing Suite

CelebrationPilot AI maintains comprehensive, verified test coverage across unit, component, API, and end-to-end user journeys:

```bash
# Run TypeScript compilation check (0 errors)
npm run type-check

# Run ESLint validation (0 errors, 0 warnings)
npm run lint

# Run Vitest unit & component test suite (15 test files, 54 passed)
npm run test

# Run Playwright end-to-end tests (7 browser specs passed)
npm run test:e2e

# Run all test suites in sequence
npm run test:all

# Production build check
npm run build
```

### Verified Test Summary

| Test Suite | Files | Passed | Status |
| :--- | :--- | :--- | :--- |
| TypeScript 5.0 Check | All (`tsc --noEmit`) | 0 Errors | **PASS** |
| ESLint 9 Validation | All | 0 Errors, 0 Warnings | **PASS** |
| Unit: Event Brief Validation | `eventBriefValidation.test.ts` | 7 / 7 | **PASS** |
| Unit: Budget Metrics & Overrun | `budgetMetrics.test.ts` | 4 / 4 | **PASS** |
| Unit: Mock Celebration Engine | `mockEventEngine.test.ts` | 4 / 4 | **PASS** |
| Unit: Domain Event Plans | `domainEventPlans.test.ts` | 2 / 2 | **PASS** |
| Unit: Event Store Persistence | `eventStore.test.ts` | 7 / 7 | **PASS** |
| Unit: Workspace Mutations | `eventStoreMutations.test.ts` | 3 / 3 | **PASS** |
| Unit: Plan Exporter & Security | `eventPlanExporter.test.ts` | 1 / 1 | **PASS** |
| Unit: XSS Sanitization | `eventPlanExporterSecurity.test.ts` | 2 / 2 | **PASS** |
| Unit: Security & Rate Limiting | `securityAndRateLimiter.test.ts` | 4 / 4 | **PASS** |
| Unit: AI Schema Repair | `geminiValidationAndRepair.test.ts` | 2 / 2 | **PASS** |
| Integration: Full Workflow | `fullWorkflow.test.ts` | 1 / 1 | **PASS** |
| Component: Concept Cards | `conceptCard.test.tsx` | 3 / 3 | **PASS** |
| Component: Workspace Tabs | `workspaceTabs.test.tsx` | 4 / 4 | **PASS** |
| Component: Planner Steps | `plannerSteps.test.tsx` | 3 / 3 | **PASS** |
| API Route: `/api/generate-plan` | `generatePlanRoute.test.ts` | 7 / 7 | **PASS** |
| Playwright E2E: Empty States | `emptyStates.spec.ts` | 3 / 3 | **PASS** |
| Playwright E2E: Wizard Validation | `wizardValidation.spec.ts` | 1 / 1 | **PASS** |
| Playwright E2E: Complete Journey | `celebrationJourney.spec.ts` | 1 / 1 | **PASS** |
| Playwright E2E: State Mutations | `taskAndBudgetInteractions.spec.ts` | 1 / 1 | **PASS** |
| Playwright E2E: Interactive Workspace | `interactiveWorkspaceWorkflow.spec.ts` | 1 / 1 | **PASS** |
| **Total Automated Tests** | **20 Test Suites** | **61 / 61 Passed** | **100% PASS** |

---

## 🔒 Transparent Privacy & Local-First Invariants

- **External Data Transmission (Google Gemini)**: When a user requests plan generation on the celebration wizard, the high-level event brief parameters (event type, destination city, guest count, budget envelope, and theme) are transmitted over secure HTTPS to the Google Gemini API (`https://generativelanguage.googleapis.com`) using either the user's custom API key or the server key to generate tailored celebration concepts.
- **Strictly Local Browser Storage**: Personal attendee lists, guest names, RSVP statuses, dietary accommodations, vendor contact emails, negotiated supplier rates, custom created tasks, and exported dossiers persist 100% on the client side in browser `localStorage` via `useSyncExternalStore`. They are never transmitted to external databases, tracking services, or remote logs.
- **Credential Protection**: Custom user API keys never persist on any database or server-side storage; they reside solely in browser `localStorage` and transmit exclusively to the Next.js API route via secure HTTPS headers for model authentication.
- **Zero-Downtime Deterministic Fallback**: Network outages, invalid credentials, or Google API quota limits gracefully fall back to domain-crafted deterministic celebration plans without crashing the user interface or leaking error traces.
- **Strict Content Sanitization**: User inputs are stripped of control characters, bounded by schema validators, and entity-escaped when generating printable HTML dossiers.

---

## ♿ Accessibility & Design (WCAG 2.2 AA)

- **Color Contrast**: All body text and UI controls maintain >= 4.5:1 contrast ratios (using Apple-inspired `#1d1d1f`, `#333333`, `#555555`, and `#0071e3`).
- **Semantic HTML & ARIA**: Form inputs include `aria-invalid` and `aria-describedby` links to alert messages. Workspace tabs implement `role="tablist"`, `role="tab"`, and `aria-selected`.
- **Keyboard Navigation**: All interactive elements (chips, tabs, dialogs, buttons) are focusable with visible focus rings.

---

## 📄 License

MIT License. Engineered for Hack2Skill Challenge 5.
