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
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e5ea] bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#42a5f5] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#1d1d1f] tracking-tight">
              CelebrationPilot <span className="text-[#0071e3]">AI</span>
            </span>
            <span className="text-[10px] text-[#86868b] tracking-wider uppercase font-medium">
              Architectural Event Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#0071e3] text-white shadow-xs'
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3]'
                )}
              >
                <Icon className="w-4 h-4" />
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] transition-all cursor-pointer shadow-2xs"
            title="Configure Custom Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>API Key</span>
            <span
              className={cn(
                'w-2 h-2 rounded-full',
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
            className="p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7]"
          >
            <Key className="w-4 h-4 text-[#0071e3]" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e5ea] bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#0071e3] text-white'
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
