'use client';

import React, { useState } from 'react';
import { GuestItem, RSVPStatus, GuestCategory } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export function GuestManager({ guests }: { guests: GuestItem[] }) {
  const { updateGuestRSVP, addGuest } = useEvent();
  const [filterRsvp, setFilterRsvp] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<GuestCategory>('Friends');
  const [newDietary, setNewDietary] = useState('Standard');
  const [newPlusOne, setNewPlusOne] = useState(false);

  const confirmed = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const pending = guests.filter((g) => g.rsvpStatus === 'Pending').length;
  const declined = guests.filter((g) => g.rsvpStatus === 'Declined').length;

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addGuest({
      name: newName.trim(),
      category: newCategory,
      rsvpStatus: 'Pending',
      dietary: newDietary.trim() || 'Standard',
      plusOne: newPlusOne,
    });
    setNewName('');
    setIsAdding(false);
  };

  const filteredGuests =
    filterRsvp === 'All' ? guests : guests.filter((g) => g.rsvpStatus === filterRsvp);

  return (
    <Card className="space-y-6 p-6 sm:p-8 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Guest List & RSVP Tracking</h3>
          <p className="text-xs text-[#555555] mt-0.5">
            Manage attendance verification, dietary requirements, and plus-one seating
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
          <UserPlus className="w-3.5 h-3.5 mr-1" />
          Add Guest
        </Button>
      </div>

      {/* Guest Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#f5f5f7] rounded-2xl text-center border border-[#e5e5ea]">
          <div className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">Invited Total</div>
          <div className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">{guests.length}</div>
        </div>
        <div className="p-4 bg-[#eaf8ee] rounded-2xl text-center border border-[#b5ecc1]">
          <div className="text-[11px] font-semibold text-[#137333] uppercase tracking-wider">Confirmed</div>
          <div className="text-2xl font-bold tracking-tight text-[#137333] mt-1">{confirmed}</div>
        </div>
        <div className="p-4 bg-[#fef7e6] rounded-2xl text-center border border-[#fce3a6]">
          <div className="text-[11px] font-semibold text-[#b06000] uppercase tracking-wider">Pending</div>
          <div className="text-2xl font-bold tracking-tight text-[#b06000] mt-1">{pending}</div>
        </div>
        <div className="p-4 bg-[#fdf0ef] rounded-2xl text-center border border-[#f9c0bb]">
          <div className="text-[11px] font-semibold text-[#d93025] uppercase tracking-wider">Declined</div>
          <div className="text-2xl font-bold tracking-tight text-[#d93025] mt-1">{declined}</div>
        </div>
      </div>

      {/* Add Guest Form */}
      {isAdding && (
        <form onSubmit={handleCreateGuest} className="bg-[#fbfbfd] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] space-y-3.5 shadow-2xs">
          <div className="text-xs font-semibold text-[#1d1d1f]">Add New Attendee</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Guest Full Name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as GuestCategory)}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl font-medium text-[#1d1d1f]"
            >
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="VIP">VIP</option>
              <option value="Colleagues">Colleagues</option>
              <option value="Plus-One">Plus-One</option>
            </select>
            <input
              type="text"
              placeholder="Dietary requirements..."
              value={newDietary}
              onChange={(e) => setNewDietary(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
            <label className="flex items-center gap-2 text-xs text-[#1d1d1f] cursor-pointer">
              <input
                type="checkbox"
                checked={newPlusOne}
                onChange={(e) => setNewPlusOne(e.target.checked)}
                className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3]"
              />
              Plus One Allowed
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Guest
            </Button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['All', 'Confirmed', 'Pending', 'Declined'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setFilterRsvp(r)}
            aria-pressed={filterRsvp === r}
            className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              filterRsvp === r
                ? 'bg-[#1d1d1f] text-white shadow-2xs'
                : 'bg-[#f5f5f7] text-[#555555] hover:bg-[#e8e8ed]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Guest Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
              <th className="py-2.5 px-3">Attendee Name</th>
              <th className="py-2.5 px-3">Group</th>
              <th className="py-2.5 px-3">Dietary Needs</th>
              <th className="py-2.5 px-3">Seating</th>
              <th className="py-2.5 px-3 text-right">RSVP Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5ea]">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-[#fbfbfd] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#1d1d1f]">{guest.name}</td>
                <td className="py-3 px-3 text-[#555555]">
                  <Badge variant="gray">{guest.category}</Badge>
                </td>
                <td className="py-3 px-3 text-[#555555]">{guest.dietary}</td>
                <td className="py-3 px-3 text-[#555555]">
                  {guest.plusOne ? (
                    <span className="text-[#0071e3] font-medium">+1 Party</span>
                  ) : (
                    'Solo'
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex rounded-lg border border-[#d2d2d7] p-0.5 bg-[#f5f5f7]">
                    {(['Confirmed', 'Pending', 'Declined'] as RSVPStatus[]).map((status) => {
                      const isActive = guest.rsvpStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateGuestRSVP(guest.id, status)}
                          aria-label={`Set RSVP for ${guest.name} to ${status}`}
                          aria-pressed={isActive}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            isActive
                              ? status === 'Confirmed'
                                ? 'bg-[#137333] text-white shadow-2xs'
                                : status === 'Pending'
                                ? 'bg-[#b06000] text-white shadow-2xs'
                                : 'bg-[#d93025] text-white shadow-2xs'
                              : 'text-[#555555] hover:text-[#1d1d1f]'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
