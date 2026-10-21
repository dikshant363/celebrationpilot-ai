import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-[#0071e3] mb-5">
        <Sparkles className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">404 — Event Page Not Found</h1>
      <p className="text-sm text-[#86868b] max-w-md mb-8">
        The celebration itinerary or event workspace you requested does not exist or has been relocated.
      </p>
      <Link href="/">
        <Button variant="primary">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Return to Celebration Studio
        </Button>
      </Link>
    </div>
  );
}
