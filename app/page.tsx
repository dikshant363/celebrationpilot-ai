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
  Lock,
  Globe2,
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
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Apple Capsule Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-xs font-semibold text-[#1d1d1f] mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Hack2Skill Challenge 5 • Google Gemini-Powered Event Planning</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-6 leading-[1.08] max-w-4xl mx-auto">
          Architect unforgettable celebrations with{' '}
          <span className="text-[#0071e3]">autonomous AI</span> precision.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#555555] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          From milestone birthdays to 500-guest weddings. Receive three tailored event
          concepts, minute-by-minute run of show, deterministic budget math, and printable
          master dossiers in seconds.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
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

        {/* Bento Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-16 pt-12 border-t border-[#e5e5ea] text-left">
          <div className="p-4 rounded-2xl bg-white border border-[#e5e5ea] shadow-xs space-y-2 hover:border-[#d2d2d7] transition-all">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              3 Archetype Plans
            </h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Compare Opulent Luxe, Boho Botanical, and High-Tech Neon concepts side-by-side.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e5e5ea] shadow-xs space-y-2 hover:border-[#d2d2d7] transition-all">
            <div className="w-9 h-9 rounded-xl bg-[#34c759]/10 flex items-center justify-center text-[#28a745]">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Zero-Deficit Budget
            </h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Deterministic category allocation with real-time overrun alerts and quote status.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e5e5ea] shadow-xs space-y-2 hover:border-[#d2d2d7] transition-all">
            <div className="w-9 h-9 rounded-xl bg-[#ff9500]/10 flex items-center justify-center text-[#b06000]">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Master Run of Show
            </h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Time-stamped schedules with designated lead coordinators and operational cues.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e5e5ea] shadow-xs space-y-2 hover:border-[#d2d2d7] transition-all">
            <div className="w-9 h-9 rounded-xl bg-[#af52de]/10 flex items-center justify-center text-[#7627bb]">
              <Printer className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
              Printable Dossier
            </h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Export full PDF event blueprints for venue staff, catering, and audio engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Celebration Domains */}
      <section className="w-full bg-[#fbfbfd] py-20 border-y border-[#e5e5ea]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-xs font-semibold text-[#555555] mb-2.5">
              <span>Tailored Curations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-3 tracking-tight">
              Engineered for every life milestone
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              CelebrationPilot AI adapts its catering models, soundscapes, and logistics
              checklists to your exact event scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="space-y-4 p-6 bg-white border border-[#e5e5ea]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <Badge variant="blue">Milestone Birthdays</Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Sweet 16, 21st, 30th & Golden Jubilees
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-1.5">
                  Personalized toast timing, signature mocktail/cocktail bars, photo installations,
                  and high-energy entertainment lineups tailored to guest demographics.
                </p>
              </div>
            </Card>

            <Card hoverEffect className="space-y-4 p-6 bg-white border border-[#e5e5ea]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#34c759]/10 flex items-center justify-center text-[#28a745]">
                  <Award className="w-5 h-5" />
                </div>
                <Badge variant="green">Weddings & Anniversaries</Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Ceremonies, Receptions & Vow Renewals
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-1.5">
                  Venue capacity alignment, vendor contract status, multi-course plated dining,
                  and emotional timeline sequencing with minute-level precision.
                </p>
              </div>
            </Card>

            <Card hoverEffect className="space-y-4 p-6 bg-white border border-[#e5e5ea]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#ff9500]/10 flex items-center justify-center text-[#b06000]">
                  <Flame className="w-5 h-5" />
                </div>
                <Badge variant="amber">Cultural & Corporate Galas</Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Festivals, Graduations & Company Banquets
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-1.5">
                  Custom dietary certification (Halal, Kosher, Vegan), keynote AV requirements,
                  and VIP attendee logistics designed to eliminate bottlenecks.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety, Transparent Privacy & BYO API Key Guarantee */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Transparent Privacy & Data Handling
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] mt-1">
              Honest, local-first architecture with clear AI boundaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-2">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#34c759]" />
                Kept Strictly in Your Browser
              </span>
              <p className="text-[#555555] leading-relaxed text-xs">
                Guest names, RSVP statuses, dietary accommodations, vendor contacts, negotiated quotes, custom tasks, and exported dossiers remain 100% in local browser storage (<code className="text-[#1d1d1f] font-mono">localStorage</code>). No user tracking or analytics databases are used.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-2">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#0071e3]" />
                Transmitted During AI Generation
              </span>
              <p className="text-[#555555] leading-relaxed text-xs">
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
