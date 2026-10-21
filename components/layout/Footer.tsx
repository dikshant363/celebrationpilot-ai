import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-black/[0.06] bg-[#fbfbfd] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#515154]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#0071e3] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[#1d1d1f]">CelebrationPilot AI</span>
          <span className="text-[#86868b]">— Architectural Event & Celebration Studio</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded">
            Overview
          </Link>
          <Link href="/planner" className="hover:text-[#1d1d1f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded">
            Event Wizard
          </Link>
          <Link href="/workspace" className="hover:text-[#1d1d1f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded">
            Workspace
          </Link>
          <Link href="/export" className="hover:text-[#1d1d1f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded">
            Export Dossier
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-[#86868b]">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-[#ff3b30] fill-current" />
          <span>for Hack2Skill Challenge 5</span>
        </div>
      </div>
    </footer>
  );
}
