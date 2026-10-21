'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEvent } from '@/lib/context/EventContext';
import { ArrowRight, Printer } from 'lucide-react';

export function SubNavFrosted() {
  const pathname = usePathname();
  const { brief, planSuite, selectedConceptId } = useEvent();

  // Only render when an event brief exists and user is not on home or wizard
  if (!brief || pathname === '/' || pathname === '/planner') {
    return null;
  }

  const activeConcept = planSuite?.concepts.find((c) => c.id === selectedConceptId);

  return (
    <aside aria-label="Active Celebration Context" className="w-full bg-[#fbfbfd]/85 border-b border-black/[0.05] px-4 py-2 backdrop-blur-md text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]" />
          </span>
          <span className="font-semibold text-[#1d1d1f] truncate max-w-[200px] sm:max-w-[320px]">
            {brief.eventTitle}
          </span>
          <span className="text-[#86868b]">•</span>
          <span className="text-[#515154]">
            {brief.eventType} in {brief.city} ({brief.guestCount} guests)
          </span>
          {activeConcept && (
            <>
              <span className="text-[#86868b]">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e8f2fe] text-[#0071e3] font-semibold text-[11px] border border-[#b9d9fc]">
                {activeConcept.title}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {pathname !== '/workspace' && (
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 font-semibold text-[#0071e3] hover:text-[#0077ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded"
            >
              Open Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {pathname !== '/export' && (
            <Link
              href="/export"
              className="inline-flex items-center gap-1 font-medium text-[#515154] hover:text-[#1d1d1f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded"
            >
              <Printer className="w-3.5 h-3.5 text-[#86868b]" />
              Printable Dossier
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
