import type { Metadata } from 'next';
import './globals.css';
import { EventProvider } from '@/lib/context/EventContext';
import { GlobalNav } from '@/components/layout/GlobalNav';
import { SubNavFrosted } from '@/components/layout/SubNavFrosted';
import { Footer } from '@/components/layout/Footer';
import { ApiKeyModal } from '@/components/ui/ApiKeyModal';

export const metadata: Metadata = {
  title: 'CelebrationPilot AI — Architectural Event & Celebration Studio',
  description:
    'Turn celebration briefs into three feasible, tailored event concepts with schedules, budgets, tasks, and guest lists powered by Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f]">
        <EventProvider>
          <GlobalNav />
          <SubNavFrosted />
          <ApiKeyModal />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </EventProvider>
      </body>
    </html>
  );
}
