'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEvent } from '@/lib/context/EventContext';
import { ArrowRight } from 'lucide-react';

export function SubNavFrosted() {
  const pathname = usePathname();
  const { brief, planSuite, selectedConceptId } = useEvent();

  // Only render when an event brief exists and user is not on home or wizard
  if (!brief || pathname === '/' || pathname === '/planner') {
    return null;
  }

  const activeConcept = planSuite?.concepts.find((c) => c.id === selectedConceptId);

  return (
    <div className="w-full bg-[#fbfbfd]/90 border-b border-[#e5e5ea] px-4 py-2.5 backdrop-blur-xs text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#137333]" />
          <span className="font-semibold text-[#1d1d1f] truncate max-w-[200px] sm:max-w-[320px]">
            {brief.eventTitle}
          </span>
          <span className="text-[#555555]">•</span>
          <span className="text-[#333333]">
            {brief.eventType} in {brief.city} ({brief.guestCount} guests)
          </span>
          {activeConcept && (
            <>
              <span className="text-[#555555]">•</span>
              <span className="px-2 py-0.5 rounded-full bg-[#e8f2fe] text-[#0071e3] font-medium text-[11px]">
                {activeConcept.title}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {pathname !== '/workspace' && (
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 font-medium text-[#0071e3] hover:underline"
            >
              Open Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {pathname !== '/export' && (
            <Link
              href="/export"
              className="inline-flex items-center gap-1 font-medium text-[#555555] hover:text-[#1d1d1f]"
            >
              Printable Dossier
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
