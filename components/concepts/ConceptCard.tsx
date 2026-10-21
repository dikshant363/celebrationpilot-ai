import React from 'react';
import { EventConcept, Currency } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Check, DollarSign, Utensils, Music, AlertTriangle, ArrowRight } from 'lucide-react';

export interface ConceptCardProps {
  concept: EventConcept;
  currency: Currency;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ConceptCard({ concept, currency, isSelected, onSelect }: ConceptCardProps) {
  return (
    <Card
      className={`relative flex flex-col justify-between transition-all duration-200 border-2 ${
        isSelected
          ? 'border-[#0071e3] shadow-lg ring-2 ring-[#0071e3]/20'
          : 'border-[#d2d2d7] hover:border-[#86868b]'
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 right-6 bg-[#0071e3] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Check className="w-3 h-3" />
          Active Selection
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge variant="blue">{concept.vibe}</Badge>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#34c759] bg-[#eaf8ee] px-2.5 py-0.5 rounded-full border border-[#b5ecc1]">
            <Sparkles className="w-3 h-3" />
            {concept.feasibilityScore}% Feasibility
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#1d1d1f] mb-1.5 leading-snug">
          {concept.title}
        </h3>
        <p className="text-xs text-[#86868b] leading-relaxed mb-4">
          {concept.tagline}
        </p>

        {/* Budget Metric */}
        <div className="bg-[#f5f5f7] rounded-xl p-3.5 mb-5 border border-[#e5e5ea] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0071e3]" />
            <span className="text-xs font-medium text-[#555555]">Est. Expenditure</span>
          </div>
          <span className="text-sm font-bold text-[#1d1d1f]">
            {currency} {concept.budgetEstimate.toLocaleString()}
          </span>
        </div>

        {/* Catering highlights */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Catering & Hospitality</span>
          </div>
          <p className="text-xs text-[#555555] font-medium pl-5">
            {concept.cateringSummary.style} (~{currency} {concept.cateringSummary.perGuestEstimate}/guest)
          </p>
          <ul className="text-xs text-[#666666] space-y-1 pl-5 list-disc list-inside">
            {concept.cateringSummary.highlights.map((h, idx) => (
              <li key={idx} className="leading-relaxed">{h}</li>
            ))}
          </ul>
        </div>

        {/* Entertainment highlights */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
            <Music className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Entertainment & Audio</span>
          </div>
          <ul className="text-xs text-[#666666] space-y-1 pl-5 list-disc list-inside">
            {concept.entertainmentHighlights.map((e, idx) => (
              <li key={idx} className="leading-relaxed">{e}</li>
            ))}
          </ul>
        </div>

        {/* Strategic justification */}
        <div className="bg-[#fbfbfd] p-3 rounded-xl border border-[#e5e5ea] text-xs space-y-2 mb-6">
          <div>
            <span className="font-semibold text-[#1d1d1f]">Why It Works: </span>
            <span className="text-[#555555]">{concept.whyThisWorks}</span>
          </div>
          <div className="flex items-start gap-1.5 pt-1 border-t border-[#e5e5ea]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ff9500] shrink-0 mt-0.5" />
            <span className="text-[#666666]">
              <strong className="text-[#1d1d1f]">Trade-off: </strong>
              {concept.tradeOffs}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant={isSelected ? 'secondary' : 'primary'}
        size="md"
        className="w-full mt-2"
        onClick={() => onSelect(concept.id)}
      >
        {isSelected ? (
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#0071e3]" />
            Selected Concept
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            Choose This Plan
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </Card>
  );
}
