# CelebrationPilot AI — Architectural Event & Celebration Studio

> **Hack2Skill Challenge 5 — AI-Powered Celebration & Event Planner**  
> An autonomous workstation that transforms event briefs into three feasible, tailored celebration concepts with minute-by-minute schedules, deterministic budgets, vendor contracts, guest RSVP tracking, and printable PDF dossiers.

---

## 🌟 Overview & Mission

Planning major life celebrations—whether milestone birthdays, weddings, anniversary galas, or corporate banquets—often suffers from fragmented spreadsheets, unrealistic vendor estimates, budget overruns, and disorganized day-of timelines.

**CelebrationPilot AI** solves this by providing:
1. **Multi-Constraint Event Brief Wizard**: Captures celebration type, hard budget, guest count, venue preferences, dietary restrictions, accessibility requirements, and entertainment vibes.
2. **Three Meaningfully Different Archetype Concepts**:
   - **Opulent Luxe**: High-touch, fine-dining, ambient spotlighting, and seamless VIP hospitality.
   - **Boho-Chic Botanical**: Warm intimacy, acoustic soundscapes, grazing stations, and sustainable eco-decor.
   - **Futuristic Neon Horizon**: Modern minimalist, 360-degree video capture, and high-energy electronic soundscapes.
3. **Deterministic Budget Engine & Overrun Detection**: Categorical allocation across venue, catering, decor, entertainment, media, and contingency. Distinguishes preliminary estimates from verified vendor quotes with automatic deficit warnings.
4. **Minute-by-Minute Run of Show**: Real-time milestone timeline assigning designated operational leads for arrivals, keynote toasts, culinary service, and cloisters.
5. **Milestone Task Checklist & Guest Registry**: Pre-celebration countdown tasks (4 Weeks Prior $\rightarrow$ Day Of) and interactive RSVP status management with dietary tags.
6. **Printable Event Master Dossier & PDF Export**: Instant generation of standardized print-ready dossiers for on-site venue managers, caterers, and decorators.
7. **BYO Gemini API Key**: Users can supply their own Google AI Studio key via a secure modal, stored in browser local storage and forwarded via secure headers.

---

## 📐 Architecture & Domain Model

```
 USER
  ↓
EVENT BRIEF WIZARD (Validations, Hard Constraints, Budget & Dietary)
  ↓
GEMINI AI GATEWAY (gemini-3.8-flash → gemini-3.5-flash → gemini-3.5-flash-lite)
  ↓ [Automatic Fallback on Network / Rate Limits]
DETERMINISTIC CELEBRATION DECISION ENGINE
  ↓
THREE FEASIBLE CELEBRATION ARCHETYPES
  ↓
WORKSPACE COMMAND CENTER (Schedule, Budget Math, Tasks, Guests, Vendors)
  ↓
SYNCHRONIZED LOCAL PERSISTENCE (useSyncExternalStore + LocalStorage)
  ↓
PRINTABLE EVENT DOSSIER & PDF EXPORT
```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.3.4 (App Router & Turbopack)](https://nextjs.org/)
- **UI & State**: React 19, Tailwind CSS v4, Lucide React, `useSyncExternalStore`
- **GenAI Engine**: `@google/genai` (Google Gemini 3.8 Flash, 3.5 Flash)
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

CelebrationPilot AI maintains comprehensive test coverage across unit, component, API, and end-to-end user journeys:

```bash
# Run TypeScript compilation check
npm run type-check

# Run ESLint validation
npm run lint

# Run Vitest unit & component test suite
npm run test

# Run Playwright end-to-end tests
npm run test:e2e

# Run all test suites
npm run test:all

# Production build check
npm run build
```

---

## 🔒 Privacy & Local-First Invariants

- **Local-First Storage**: Event briefs, concepts, tasks, and guest lists persist in client-side storage.
- **Credential Protection**: Custom user API keys never persist on any database or external logging platform; they reside only in browser `localStorage` and transmit solely via HTTPS headers.
- **Zero-Downtime Guarantee**: Outages or quota limits gracefully fall back to domain-crafted deterministic celebration plans.

---

## 📄 License

MIT License. Engineered for Hack2Skill Challenge 5.
