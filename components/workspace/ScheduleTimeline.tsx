'use client';

import React, { useState } from 'react';
import { ScheduleItem } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, User, Plus } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export function ScheduleTimeline({ schedule }: { schedule: ScheduleItem[] }) {
  const { addScheduleItem } = useEvent();
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('19:00');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLead, setNewLead] = useState('Host / Coordinator');

  const handleCreateScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime.trim() || !newTitle.trim()) return;

    addScheduleItem({
      time: newTime.trim(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom celebration milestone',
      lead: newLead.trim() || 'Coordinator',
    });

    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <Card className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1d1d1f]">Master Run of Show</h3>
          <p className="text-xs text-[#555555]">Minute-by-minute execution timeline for hosts and vendor leads</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f5f5f7] text-[#333333] border border-[#d2d2d7]">
            {schedule.length} Milestones
          </span>
          <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Add Milestone Form */}
      {isAdding && (
        <form onSubmit={handleCreateScheduleItem} className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] space-y-3">
          <div className="text-xs font-semibold text-[#1d1d1f]">Add Timeline Milestone</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Time (e.g. 19:30)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              required
            />
            <input
              type="text"
              placeholder="Milestone Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              required
            />
            <input
              type="text"
              placeholder="Operational Lead"
              value={newLead}
              onChange={(e) => setNewLead(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
            <input
              type="text"
              placeholder="Detailed operational instructions & cues..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="sm:col-span-4 px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Milestone
            </Button>
          </div>
        </form>
      )}

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

            <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#555555] bg-[#f5f5f7] px-2.5 py-1 rounded-full self-start">
              <User className="w-3 h-3 text-[#555555]" />
              <span className="font-medium">{item.lead}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
