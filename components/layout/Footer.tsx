import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e5e5ea] bg-[#fbfbfd] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#555555]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#0071e3] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[#1d1d1f]">CelebrationPilot AI</span>
          <span>— Architectural Event & Celebration Studio</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            Overview
          </Link>
          <Link href="/planner" className="hover:text-[#1d1d1f] transition-colors">
            Event Wizard
          </Link>
          <Link href="/workspace" className="hover:text-[#1d1d1f] transition-colors">
            Workspace
          </Link>
          <Link href="/export" className="hover:text-[#1d1d1f] transition-colors">
            Export Dossier
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-[#ff3b30] fill-current" />
          <span>for Hack2Skill Challenge 5</span>
        </div>
      </div>
    </footer>
  );
}
