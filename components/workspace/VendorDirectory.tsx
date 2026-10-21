'use client';

import React, { useState } from 'react';
import { VendorItem, Currency, VendorStatus } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2, Plus, Edit3, Check } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export function VendorDirectory({
  vendors,
  currency,
}: {
  vendors: VendorItem[];
  currency: Currency;
}) {
  const { updateVendor, addVendor } = useEvent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actualCostInput, setActualCostInput] = useState<number | string>('');
  const [isAdding, setIsAdding] = useState(false);

  // New vendor form state
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('');
  const [newEstCost, setNewEstCost] = useState<number>(1000);
  const [newStatus, setNewStatus] = useState<VendorStatus>('Contacted');
  const [newContact, setNewContact] = useState('');

  const handleStartEdit = (vendor: VendorItem) => {
    setEditingId(vendor.id);
    setActualCostInput(vendor.actualCost !== null ? vendor.actualCost : '');
  };

  const handleSaveEdit = (vendorId: string) => {
    const cost =
      actualCostInput === '' || isNaN(Number(actualCostInput))
        ? null
        : Number(actualCostInput);
    updateVendor(vendorId, { actualCost: cost });
    setEditingId(null);
  };

  const handleStatusChange = (vendorId: string, status: VendorStatus) => {
    updateVendor(vendorId, { status });
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newService.trim()) return;

    addVendor({
      name: newName.trim(),
      service: newService.trim(),
      estimatedCost: Number(newEstCost) || 0,
      actualCost: null,
      status: newStatus,
      contact: newContact.trim() || 'liaison@vendor.com',
    });

    setNewName('');
    setNewService('');
    setNewEstCost(1000);
    setNewContact('');
    setIsAdding(false);
  };

  const bookedCount = vendors.filter((v) => v.status === 'Booked').length;

  return (
    <Card className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <h3 className="text-lg font-bold text-[#1d1d1f]">Vendor & Partner Directory</h3>
          <p className="text-xs text-[#555555]">
            Track verified supplier contracts, negotiated quotes, and direct liaison contacts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-[#333333] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#d2d2d7]">
            {bookedCount} of {vendors.length} Contracts Booked
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-3.5 h-3.5" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="bg-[#fbfbfd] p-3 rounded-xl border border-[#e5e5ea] text-xs text-[#333333] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0" />
        <span>
          CelebrationPilot AI strictly separates preliminary market estimates from verified contract quotes to prevent surprise billing.
        </span>
      </div>

      {/* Add Vendor Form */}
      {isAdding && (
        <form onSubmit={handleAddVendor} className="bg-[#f5f5f7] p-4 rounded-2xl border border-[#e5e5ea] space-y-3">
          <div className="text-xs font-semibold text-[#1d1d1f]">Add New Supplier / Vendor</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Vendor / Company Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              required
            />
            <input
              type="text"
              placeholder="Service Scope (e.g. Florals)"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              required
            />
            <input
              type="number"
              placeholder="Estimated Cost"
              value={newEstCost}
              onChange={(e) => setNewEstCost(Number(e.target.value))}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as VendorStatus)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl"
            >
              <option value="Proposed">Proposed</option>
              <option value="Contacted">Contacted</option>
              <option value="Quoted">Quoted</option>
              <option value="Booked">Booked</option>
            </select>
            <input
              type="email"
              placeholder="Contact Email"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Vendor
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
              <th className="py-2.5 px-3">Vendor / Partner</th>
              <th className="py-2.5 px-3">Service Scope</th>
              <th className="py-2.5 px-3">Estimated</th>
              <th className="py-2.5 px-3">Contract Quote</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions / Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5ea]">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-[#fbfbfd]">
                <td className="py-3 px-3 font-semibold text-[#1d1d1f]">{vendor.name}</td>
                <td className="py-3 px-3 text-[#555555]">{vendor.service}</td>
                <td className="py-3 px-3 text-[#555555]">
                  {currency} {vendor.estimatedCost.toLocaleString()}
                </td>
                <td className="py-3 px-3 font-medium text-[#1d1d1f]">
                  {editingId === vendor.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="Cost"
                        value={actualCostInput}
                        onChange={(e) => setActualCostInput(e.target.value)}
                        className="w-24 px-2 py-1 text-xs border border-[#0071e3] rounded-md font-mono"
                        aria-label={`Actual cost for ${vendor.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(vendor.id)}
                        className="p-1 text-[#0071e3] hover:bg-[#e8f2fe] rounded"
                        aria-label="Save actual cost"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : vendor.actualCost !== null ? (
                    <span className="font-semibold text-[#1d1d1f]">
                      {currency} {vendor.actualCost.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[#636366] italic">Pending Quote</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <select
                    value={vendor.status}
                    onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                    aria-label={`Status for ${vendor.name}`}
                    className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-[#d2d2d7] bg-white cursor-pointer"
                  >
                    <option value="Proposed">Proposed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Booked">Booked</option>
                  </select>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    {editingId !== vendor.id && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(vendor)}
                        className="p-1 rounded-md text-[#555555] hover:text-[#0071e3] hover:bg-[#f5f5f7]"
                        aria-label={`Edit contract quote for ${vendor.name}`}
                        title="Edit contract quote"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <a
                      href={`mailto:${vendor.contact}`}
                      className="inline-flex items-center gap-1 text-[#0071e3] hover:underline font-medium"
                      aria-label={`Email ${vendor.name} at ${vendor.contact}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Liaison</span>
                    </a>
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
