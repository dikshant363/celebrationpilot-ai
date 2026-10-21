'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Layers, CheckSquare, Printer, Key, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEvent } from '@/lib/context/EventContext';

export function GlobalNav() {
  const pathname = usePathname();
  const { userApiKey, setIsApiKeyModalOpen } = useEvent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Sparkles },
    { name: 'Plan Event', href: '/planner', icon: Calendar },
    { name: 'Concepts', href: '/concepts', icon: Layers },
    { name: 'Workspace', href: '/workspace', icon: CheckSquare },
    { name: 'Export Dossier', href: '/export', icon: Printer },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#5ac8fa] flex items-center justify-center text-white shadow-[0_2px_6px_rgba(0,113,227,0.25)] group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#1d1d1f] tracking-tight leading-tight">
              CelebrationPilot <span className="text-[#0071e3]">AI</span>
            </span>
            <span className="text-[10px] text-[#86868b] tracking-wider uppercase font-semibold">
              Architectural Event Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f5f5f7]/80 p-1 rounded-full border border-black/[0.04]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold'
                    : 'text-[#515154] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-[#0071e3]' : 'text-[#86868b]')} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            aria-label="Configure Custom Google Gemini API Key"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] active:bg-[#e8e8ed] text-[#1d1d1f] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
            title="Configure Custom Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>API Key</span>
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                userApiKey ? 'bg-[#34c759]' : 'bg-[#d2d2d7]'
              )}
            />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            aria-label="API Key settings"
            className="p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
          >
            <Key className="w-4 h-4 text-[#0071e3]" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#e8f2fe] text-[#0071e3] font-semibold'
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
