'use client';

import React, { useState } from 'react';
import { BudgetItem, BudgetMetrics, Currency } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2, ShieldCheck, Edit3, Plus, Check } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export interface BudgetManagerProps {
  breakdown: BudgetItem[];
  metrics: BudgetMetrics;
  currency: Currency;
}

export function BudgetManager({ breakdown, metrics, currency }: BudgetManagerProps) {
  const { updateBudgetItem, addBudgetItem } = useEvent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [spentInput, setSpentInput] = useState<number>(0);
  const [allocatedInput, setAllocatedInput] = useState<number>(0);

  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('Decor & Styling');
  const [newAllocated, setNewAllocated] = useState<number>(1000);
  const [newSpent, setNewSpent] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');

  const handleEditClick = (item: BudgetItem) => {
    setEditingId(item.id);
    setSpentInput(item.spent);
    setAllocatedInput(item.allocated);
  };

  const handleSaveItem = (itemId: string) => {
    updateBudgetItem(itemId, {
      spent: Number(spentInput) || 0,
      allocated: Number(allocatedInput) || 0,
    });
    setEditingId(null);
  };

  const handleCreateBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    addBudgetItem({
      category: newCategory.trim(),
      allocated: Number(newAllocated) || 0,
      spent: Number(newSpent) || 0,
      notes: newNotes.trim() || 'Custom item quota',
      isVerifiedQuote: false,
    });

    setNewNotes('');
    setNewAllocated(1000);
    setNewSpent(0);
    setIsAdding(false);
  };

  const percentSpent = Math.min(
    100,
    metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#555555]">Total Budget</div>
          <div className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1.5">
            {currency} {metrics.totalBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">Set in Event Brief</div>
        </Card>

        <Card className="p-5 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#555555]">Spent / Committed</div>
          <div className="text-2xl font-bold tracking-tight text-[#0071e3] mt-1.5">
            {currency} {metrics.totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">{percentSpent}% of total funds</div>
        </Card>

        <Card className="p-5 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#555555]">Remaining Envelope</div>
          <div
            className={`text-2xl font-bold tracking-tight mt-1.5 ${
              metrics.isOverBudget ? 'text-[#ff3b30]' : 'text-[#34c759]'
            }`}
          >
            {currency} {metrics.remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">
            {metrics.isOverBudget ? 'Deficit Warning' : 'Available for buffer'}
          </div>
        </Card>

        <Card className="p-5 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#555555]">Quote Reliability</div>
          <div className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1.5">
            {metrics.verifiedQuotePercentage}%
          </div>
          <div className="text-[11px] text-[#34c759] mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Vendor Quotes
          </div>
        </Card>
      </div>

      {/* Over budget Alert */}
      {metrics.isOverBudget && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-[#fff2f2] border border-[#ff3b30]/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-[#ff3b30] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1d1d1f] space-y-1">
            <strong className="text-[#ff3b30] font-semibold text-sm">Budget Overrun Detected</strong>
            <p className="leading-relaxed text-[#555555]">
              Current commitments exceed your allocated event budget by{' '}
              <strong className="text-[#ff3b30]">
                {currency} {metrics.overBudgetAmount.toLocaleString()}
              </strong>
              . Reallocate funds from secondary categories or negotiate vendor quotes.
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar Card */}
      <Card className="p-5 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs space-y-2.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[#1d1d1f]">Budget Utilization</span>
          <span className={metrics.isOverBudget ? 'text-[#ff3b30]' : 'text-[#0071e3]'}>
            {percentSpent}% Spent
          </span>
        </div>
        <div className="w-full bg-[#f5f5f7] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#e5e5ea]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              metrics.isOverBudget ? 'bg-[#ff3b30]' : 'bg-[#0071e3]'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="p-0 overflow-hidden bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
        <div className="p-5 sm:p-6 border-b border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">Category Budget Allocation</h3>
            <p className="text-xs text-[#555555] mt-0.5">
              Transparent accounting of allocated, committed, and remaining category quotas
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Budget Line
          </Button>
        </div>

        {/* Add Budget Item Form */}
        {isAdding && (
          <form onSubmit={handleCreateBudgetItem} className="m-5 p-4 sm:p-5 bg-[#fbfbfd] rounded-2xl border border-[#e5e5ea] space-y-3.5 shadow-2xs">
            <div className="text-xs font-semibold text-[#1d1d1f]">New Budget Allocation Item</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                required
              />
              <input
                type="number"
                placeholder="Allocated Amount"
                value={newAllocated}
                onChange={(e) => setNewAllocated(Number(e.target.value))}
                className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                required
              />
              <input
                type="number"
                placeholder="Spent So Far"
                value={newSpent}
                onChange={(e) => setNewSpent(Number(e.target.value))}
                className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
              />
              <input
                type="text"
                placeholder="Operational Notes..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit">
                Save Budget Line
              </Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Allocated</th>
                <th className="py-3 px-4">Spent / Committed</th>
                <th className="py-3 px-4">Quote Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea]">
              {breakdown.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbfbfd] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{item.category}</td>
                  <td className="py-3.5 px-4 text-[#555555]">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={allocatedInput}
                        onChange={(e) => setAllocatedInput(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-[#0071e3] rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                        aria-label={`Allocated budget for ${item.category}`}
                      />
                    ) : (
                      `${currency} ${item.allocated.toLocaleString()}`
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={spentInput}
                          onChange={(e) => setSpentInput(Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-[#0071e3] rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                          aria-label={`Spent budget for ${item.category}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveItem(item.id)}
                          className="p-1.5 text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Save amounts for ${item.category}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={item.spent > item.allocated ? 'text-[#ff3b30] font-semibold' : 'text-[#1d1d1f]'}>
                        {currency} {item.spent.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() =>
                        updateBudgetItem(item.id, { isVerifiedQuote: !item.isVerifiedQuote })
                      }
                      title="Click to toggle verified quote status"
                      aria-label={`Toggle verified quote status for ${item.category}`}
                      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded"
                    >
                      {item.isVerifiedQuote ? (
                        <Badge variant="blue" className="gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#0071e3]" />
                          Verified Quote
                        </Badge>
                      ) : (
                        <Badge variant="gray">Estimated</Badge>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-[#555555] max-w-xs truncate">{item.notes}</td>
                  <td className="py-3.5 px-4 text-right">
                    {editingId !== item.id && (
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="text-[#0071e3] hover:text-[#0077ed] p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                        aria-label={`Update budget for ${item.category}`}
                        title="Update budget values"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
