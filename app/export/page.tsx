'use client';

import React from 'react';
import Link from 'next/link';
import { useEvent } from '@/lib/context/EventContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Printer,
  Download,
  ArrowLeft,
} from 'lucide-react';
import {
  exportEventPlanToPrint,
  exportEventPlanAsJson,
} from '@/lib/export/eventPlanExporter';

export default function ExportPage() {
  const { brief, planSuite, currentPlan, budgetMetrics } = useEvent();

  if (!brief || !planSuite || !currentPlan || !budgetMetrics) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="No Celebration Plan to Export"
          description="You haven't generated an event plan yet. Complete the event brief wizard to create and export your celebration dossier."
          actionText="Create Celebration Brief"
          actionHref="/planner"
        />
      </div>
    );
  }

  const handlePrint = () => {
    exportEventPlanToPrint(brief, currentPlan, budgetMetrics);
  };

  const handleDownloadJson = () => {
    exportEventPlanAsJson(brief, currentPlan, budgetMetrics);
  };

  const confirmedGuests = currentPlan.guestList.filter((g) => g.rsvpStatus === 'Confirmed').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-6 mb-8">
        <div>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Workspace
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
            Printable Celebration Dossier
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Official event execution blueprint ready for print distribution and PDF archiving
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={handleDownloadJson}>
            <Download className="w-4 h-4 mr-1.5" />
            Download JSON
          </Button>
          <Button variant="primary" size="md" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Printable Preview Sheet */}
      <Card className="p-8 sm:p-12 space-y-8 bg-white border border-[#d2d2d7] shadow-md">
        {/* Dossier Header */}
        <div className="border-b-2 border-[#0071e3] pb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-[#e8f2fe] text-[#0071e3] text-[11px] font-bold uppercase tracking-wider mb-2">
            CelebrationPilot AI — Master Event Dossier
          </div>
          <h2 className="text-3xl font-bold text-[#1d1d1f]">{brief.eventTitle}</h2>
          <p className="text-sm text-[#86868b] mt-1">
            {currentPlan.title} • {currentPlan.tagline}
          </p>
        </div>

        {/* Key Parameters Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#fbfbfd] p-4 rounded-xl border border-[#e5e5ea]">
            <div className="text-[11px] uppercase font-semibold text-[#86868b]">Date & City</div>
            <div className="text-sm font-bold text-[#1d1d1f] mt-1">
              {brief.targetDate} • {brief.city}
            </div>
            <div className="text-xs text-[#555555] mt-0.5">{brief.eventType}</div>
          </div>

          <div className="bg-[#fbfbfd] p-4 rounded-xl border border-[#e5e5ea]">
            <div className="text-[11px] uppercase font-semibold text-[#86868b]">Venue & Scale</div>
            <div className="text-sm font-bold text-[#1d1d1f] mt-1">
              {brief.venueType}
            </div>
            <div className="text-xs text-[#555555] mt-0.5">{brief.guestCount} Attendees ({confirmedGuests} Confirmed)</div>
          </div>

          <div className="bg-[#fbfbfd] p-4 rounded-xl border border-[#e5e5ea]">
            <div className="text-[11px] uppercase font-semibold text-[#86868b]">Financial Envelope</div>
            <div className="text-sm font-bold text-[#0071e3] mt-1">
              {brief.currency} {budgetMetrics.totalSpent.toLocaleString()} / {brief.currency} {brief.budgetTotal.toLocaleString()}
            </div>
            <div className="text-xs text-[#34c759] mt-0.5">{budgetMetrics.verdict} Envelope</div>
          </div>
        </div>

        {/* Master Schedule Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#1d1d1f] border-b border-[#e5e5ea] pb-2">
            Run of Show Execution Timeline
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
                <th className="py-2 px-3 w-20">Time</th>
                <th className="py-2 px-3 w-48">Activity</th>
                <th className="py-2 px-3">Operational Notes</th>
                <th className="py-2 px-3 w-36">Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]">
              {currentPlan.schedule.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0071e3]">{item.time}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#1d1d1f]">{item.title}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{item.description}</td>
                  <td className="py-2.5 px-3 text-[#666666]">{item.lead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Budget Allocation Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#1d1d1f] border-b border-[#e5e5ea] pb-2">
            Budget Quotas & Committed Expenditure
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Allocated ({brief.currency})</th>
                <th className="py-2 px-3">Committed ({brief.currency})</th>
                <th className="py-2 px-3">Verification</th>
                <th className="py-2 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]">
              {currentPlan.budgetBreakdown.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-3 font-semibold text-[#1d1d1f]">{item.category}</td>
                  <td className="py-2.5 px-3 text-[#555555]">{item.allocated.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-[#1d1d1f] font-medium">{item.spent.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    {item.isVerifiedQuote ? (
                      <span className="text-[#0071e3] font-semibold">✓ Verified Quote</span>
                    ) : (
                      <span className="text-[#86868b]">Estimated</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-[#666666]">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Milestone Tasks Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#1d1d1f] border-b border-[#e5e5ea] pb-2">
            Key Milestone Deliverables
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
                <th className="py-2 px-3 w-32">Timeline Phase</th>
                <th className="py-2 px-3">Task Deliverable</th>
                <th className="py-2 px-3 w-28">Priority</th>
                <th className="py-2 px-3 w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]">
              {currentPlan.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="py-2.5 px-3 text-[#555555]">{task.duePhase}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#1d1d1f]">{task.title}</td>
                  <td className="py-2.5 px-3">{task.priority}</td>
                  <td className="py-2.5 px-3 font-medium">
                    <span
                      className={
                        task.status === 'Completed'
                          ? 'text-[#28a745]'
                          : task.status === 'In Progress'
                          ? 'text-[#b06000]'
                          : 'text-[#86868b]'
                      }
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Signature Block */}
        <div className="pt-8 border-t border-[#e5e5ea] text-xs text-[#86868b] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CelebrationPilot AI • Architectural Event Intelligence Platform</span>
          <span>Dossier Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </Card>
    </div>
  );
}
