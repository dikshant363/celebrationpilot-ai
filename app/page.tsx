'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Layers,
  DollarSign,
  Printer,
  ArrowRight,
  ShieldCheck,
  PartyPopper,
  Flame,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useEvent } from '@/lib/context/EventContext';
import { EventBrief } from '@/lib/types/event';

export default function HomePage() {
  const router = useRouter();
  const { generatePlan } = useEvent();

  const handleLaunchSample = async (sampleType: string) => {
    const sampleBrief: EventBrief = {
      eventType: sampleType === 'Wedding' ? 'Wedding' : 'Birthday',
      eventTitle:
        sampleType === 'Wedding'
          ? 'Elysian Garden Sunset Wedding'
          : '30th Golden Milestone Jubilee',
      targetDate: '2026-11-20',
      city: 'San Francisco, CA',
      venueType: sampleType === 'Wedding' ? 'Outdoor Garden' : 'Rooftop',
      guestCount: sampleType === 'Wedding' ? 120 : 65,
      budgetTotal: sampleType === 'Wedding' ? 35000 : 9500,
      currency: 'USD',
      themePreference:
        sampleType === 'Wedding' ? 'Modern Botanical Luxe' : 'Mid-Century Velvet & Gold',
      dietaryRestrictions: ['Vegetarian', 'Gluten-Free', 'Halal'],
      accessibilityRequirements: ['Wheelchair Ramp Access', 'Assisted Seating Zone'],
      vibeAndPriorities: [
        'High-Energy Live Band',
        'Interactive Chef Culinary Stations',
        'Immersive Starlight Ambience',
      ],
      specialRequests:
        'Coordinate surprise acoustic entrance song and custom take-home floral keepsakes.',
    };

    await generatePlan(sampleBrief);
    router.push('/concepts');
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] text-xs font-semibold text-[#1d1d1f] mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Hack2Skill Challenge 5 • Google Gemini-Powered Event Planning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6 leading-[1.08]">
          Architect unforgettable celebrations with{' '}
          <span className="text-[#0071e3]">autonomous AI</span> precision.
        </h1>

        <p className="text-lg sm:text-xl text-[#555555] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          From milestone birthdays to 500-guest weddings. Receive three tailored event
          concepts, minute-by-minute run of show, deterministic budget math, and printable
          master dossiers in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/planner">
            <Button size="lg" variant="primary">
              <span className="flex items-center gap-2">
                Plan Your Celebration
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleLaunchSample('Wedding')}
          >
            Load Sample Wedding Suite
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-[#e5e5ea] text-left">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#e8f2fe] flex items-center justify-center text-[#0071e3]">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              3 Archetype Plans
            </h4>
            <p className="text-xs text-[#555555]">
              Compare Opulent Luxe, Boho Botanical, and High-Tech Neon concepts.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#eaf8ee] flex items-center justify-center text-[#28a745]">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Zero-Deficit Budget
            </h4>
            <p className="text-xs text-[#555555]">
              Deterministic category allocation with real-time overrun alerts.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#fef7e6] flex items-center justify-center text-[#b06000]">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Master Run of Show
            </h4>
            <p className="text-xs text-[#555555]">
              Time-stamped schedules with designated lead coordinators.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#f3edfd] flex items-center justify-center text-[#7627bb]">
              <Printer className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Printable Dossier
            </h4>
            <p className="text-xs text-[#555555]">
              Export full PDF event blueprints for venues and catering staff.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Celebration Domains */}
      <section className="w-full bg-[#f5f5f7] py-20 border-y border-[#e5e5ea]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-3">
              Engineered for every life milestone
            </h2>
            <p className="text-sm text-[#555555]">
              CelebrationPilot AI adapts its catering models, soundscapes, and logistics
              checklists to your exact event scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="space-y-3">
              <div className="flex items-center justify-between">
                <PartyPopper className="w-6 h-6 text-[#0071e3]" />
                <Badge variant="blue">Milestone Birthdays</Badge>
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">
                Sweet 16, 21st, 30th & Golden Jubilees
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Personalized toast timing, signature mocktail/cocktail bars, photo installations,
                and high-energy entertainment lineups.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="flex items-center justify-between">
                <Award className="w-6 h-6 text-[#28a745]" />
                <Badge variant="green">Weddings & Anniversaries</Badge>
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">
                Ceremonies, Receptions & Vow Renewals
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Venue capacity alignment, vendor contract status, multi-course plated dining,
                and emotional timeline sequencing.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="flex items-center justify-between">
                <Flame className="w-6 h-6 text-[#b06000]" />
                <Badge variant="amber">Cultural & Corporate Galas</Badge>
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">
                Festivals, Graduations & Company Banquets
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Custom dietary certification (Halal, Kosher, Vegan), keynote AV requirements,
                and VIP attendee logistics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety, Transparent Privacy & BYO API Key Guarantee */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#d2d2d7] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f2fe] flex items-center justify-center text-[#0071e3] mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
              Transparent Privacy & Data Handling
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] mt-1">
              Honest, local-first architecture with clear AI boundaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-2">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                Kept Strictly in Your Browser
              </span>
              <p className="text-[#555555] leading-relaxed">
                Guest names, RSVP statuses, dietary accommodations, vendor contacts, negotiated quotes, custom tasks, and exported dossiers remain 100% in local browser storage (<code className="text-[#1d1d1f] font-mono">localStorage</code>). No user tracking or analytics databases are used.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-2">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                Transmitted During AI Generation
              </span>
              <p className="text-[#555555] leading-relaxed">
                When you generate concepts, high-level brief constraints (celebration type, city, headcount, budget envelope, and theme) are transmitted over secure HTTPS to Google&apos;s Gemini API to produce your custom plan suite.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#555555] max-w-xl mx-auto leading-relaxed">
            You can supply your personal Google AI Studio API key via the key icon in the navigation bar. Your key is stored exclusively in your browser and used solely for your requests.
          </p>

          <div className="pt-2">
            <Link href="/planner">
              <Button variant="primary">Launch Event Wizard</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
