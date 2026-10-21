import React from 'react';
import { ScheduleItem } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Clock, User } from 'lucide-react';

export function ScheduleTimeline({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1d1d1f]">Master Run of Show</h3>
          <p className="text-xs text-[#86868b]">Minute-by-minute execution timeline for hosts and vendor leads</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f5f5f7] text-[#555555] border border-[#d2d2d7]">
          {schedule.length} Milestones
        </span>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e5e5ea]">
        {schedule.map((item, idx) => (
          <div key={idx} className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 group">
            {/* Timeline dot */}
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-3 border-[#0071e3] shadow-xs group-hover:scale-110 transition-transform" />

            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0071e3] bg-[#e8f2fe] px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
                <h4 className="text-sm font-semibold text-[#1d1d1f]">{item.title}</h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed pl-1">{item.description}</p>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#666666] bg-[#f5f5f7] px-2.5 py-1 rounded-full self-start">
              <User className="w-3 h-3 text-[#86868b]" />
              <span className="font-medium">{item.lead}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
