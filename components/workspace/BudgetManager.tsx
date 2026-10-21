'use client';

import React, { useState } from 'react';
import { BudgetItem, BudgetMetrics, Currency } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle2, ShieldCheck, Edit3 } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export interface BudgetManagerProps {
  breakdown: BudgetItem[];
  metrics: BudgetMetrics;
  currency: Currency;
}

export function BudgetManager({ breakdown, metrics, currency }: BudgetManagerProps) {
  const { updateBudgetItem } = useEvent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [spentInput, setSpentInput] = useState<number>(0);

  const handleEditClick = (item: BudgetItem) => {
    setEditingId(item.id);
    setSpentInput(item.spent);
  };

  const handleSaveSpent = (itemId: string) => {
    updateBudgetItem(itemId, { spent: Number(spentInput) || 0 });
    setEditingId(null);
  };

  const percentSpent = Math.min(
    100,
    metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="text-xs uppercase font-semibold text-[#86868b]">Total Budget</div>
          <div className="text-xl font-bold text-[#1d1d1f] mt-1">
            {currency} {metrics.totalBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">Set in Event Brief</div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-xs uppercase font-semibold text-[#86868b]">Spent / Committed</div>
          <div className="text-xl font-bold text-[#0071e3] mt-1">
            {currency} {metrics.totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">{percentSpent}% of total funds</div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-xs uppercase font-semibold text-[#86868b]">Remaining Envelope</div>
          <div
            className={`text-xl font-bold mt-1 ${
              metrics.isOverBudget ? 'text-[#ff3b30]' : 'text-[#34c759]'
            }`}
          >
            {currency} {metrics.remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">
            {metrics.isOverBudget ? 'Deficit Warning' : 'Available for buffer'}
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-xs uppercase font-semibold text-[#86868b]">Quote Reliability</div>
          <div className="text-xl font-bold text-[#1d1d1f] mt-1">
            {metrics.verifiedQuotePercentage}%
          </div>
          <div className="text-[11px] text-[#34c759] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified Vendor Quotes
          </div>
        </Card>
      </div>

      {/* Over budget Alert */}
      {metrics.isOverBudget && (
        <div className="bg-[#fdf0ef] border border-[#f9c0bb] rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff3b30] shrink-0 mt-0.5" />
          <div className="text-xs text-[#555555] space-y-1">
            <strong className="text-[#d93025] font-semibold text-sm">Budget Overrun Detected</strong>
            <p>
              Current commitments exceed your allocated event budget by{' '}
              <strong>
                {currency} {metrics.overBudgetAmount.toLocaleString()}
              </strong>
              . Reallocate funds from secondary categories or negotiate vendor quotes.
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[#1d1d1f]">Budget Utilization</span>
          <span className={metrics.isOverBudget ? 'text-[#ff3b30]' : 'text-[#0071e3]'}>
            {percentSpent}% Spent
          </span>
        </div>
        <div className="w-full bg-[#e5e5ea] h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              metrics.isOverBudget ? 'bg-[#ff3b30]' : 'bg-[#0071e3]'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-[#e5e5ea] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">Category Budget Allocation</h3>
            <p className="text-xs text-[#86868b]">
              Transparent accounting of allocated, committed, and remaining category quotas
            </p>
          </div>
        </div>

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
                    {currency} {item.allocated.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={spentInput}
                          onChange={(e) => setSpentInput(Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-[#0071e3] rounded-md text-xs font-mono"
                        />
                        <button
                          onClick={() => handleSaveSpent(item.id)}
                          className="text-[11px] text-[#0071e3] font-semibold hover:underline"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className={item.spent > item.allocated ? 'text-[#ff3b30]' : 'text-[#1d1d1f]'}>
                        {currency} {item.spent.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        updateBudgetItem(item.id, { isVerifiedQuote: !item.isVerifiedQuote })
                      }
                      title="Click to toggle verified quote status"
                      className="cursor-pointer"
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
                  <td className="py-3.5 px-4 text-[#666666] max-w-xs truncate">{item.notes}</td>
                  <td className="py-3.5 px-4 text-right">
                    {editingId !== item.id && (
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-[#0071e3] hover:text-[#0077ed] p-1 rounded-md hover:bg-[#f5f5f7]"
                        title="Update spent amount"
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
