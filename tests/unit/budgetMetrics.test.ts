import { describe, test, expect } from 'vitest';
import { calculateBudgetMetrics } from '@/lib/ai/mockEventEngine';
import { BudgetItem } from '@/lib/types/event';

describe('Unit: Budget Metrics & Deterministic Arithmetic', () => {
  const sampleBreakdown: BudgetItem[] = [
    { id: 'b1', category: 'Venue', allocated: 5000, spent: 4000, notes: '', isVerifiedQuote: true },
    { id: 'b2', category: 'Catering', allocated: 6000, spent: 5000, notes: '', isVerifiedQuote: true },
    { id: 'b3', category: 'Decor & Styling', allocated: 2000, spent: 1500, notes: '', isVerifiedQuote: false },
    { id: 'b4', category: 'Entertainment & Sound', allocated: 2000, spent: 1500, notes: '', isVerifiedQuote: true },
  ];

  test('calculates accurate total allocated and spent amounts', () => {
    const metrics = calculateBudgetMetrics(16000, sampleBreakdown);
    expect(metrics.totalAllocated).toBe(15000);
    expect(metrics.totalSpent).toBe(12000);
    expect(metrics.remainingBudget).toBe(4000);
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.overBudgetAmount).toBe(0);
    expect(metrics.verdict).toBe('Optimal');
  });

  test('detects budget overruns and calculates deficit', () => {
    const overBudgetBreakdown: BudgetItem[] = [
      { id: 'b1', category: 'Venue', allocated: 10000, spent: 12000, notes: '', isVerifiedQuote: true },
      { id: 'b2', category: 'Catering', allocated: 8000, spent: 9000, notes: '', isVerifiedQuote: false },
    ];

    const metrics = calculateBudgetMetrics(18000, overBudgetBreakdown);
    expect(metrics.totalSpent).toBe(21000);
    expect(metrics.remainingBudget).toBe(-3000);
    expect(metrics.isOverBudget).toBe(true);
    expect(metrics.overBudgetAmount).toBe(3000);
    expect(metrics.verdict).toBe('Over Budget');
  });

  test('detects tight budget envelopes when remaining is under 10%', () => {
    const tightBreakdown: BudgetItem[] = [
      { id: 'b1', category: 'Venue', allocated: 10000, spent: 9500, notes: '', isVerifiedQuote: true },
    ];

    const metrics = calculateBudgetMetrics(10000, tightBreakdown);
    expect(metrics.remainingBudget).toBe(500); // 5% remaining
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.verdict).toBe('Tight');
  });

  test('computes percentage of verified quotes correctly', () => {
    const metrics = calculateBudgetMetrics(16000, sampleBreakdown);
    // 3 out of 4 items are verified quotes = 75%
    expect(metrics.verifiedQuotePercentage).toBe(75);
  });
});
