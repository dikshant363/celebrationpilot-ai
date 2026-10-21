import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConceptCard } from '@/components/concepts/ConceptCard';
import { EventConcept } from '@/lib/types/event';

describe('Component: ConceptCard', () => {
  const sampleConcept: EventConcept = {
    id: 'concept-1',
    title: 'Sunset Garden Gala',
    tagline: 'High-touch romantic floral celebration with live string quartet',
    vibe: 'Sophisticated & Intimate',
    feasibilityScore: 96,
    budgetEstimate: 15000,
    categoryShares: {
      venue: 0.3,
      catering: 0.3,
      decor: 0.15,
      entertainment: 0.1,
      photography: 0.05,
      logistics: 0.05,
      contingency: 0.05,
    },
    decorConcept: 'Fairylights and hanging greenery.',
    cateringSummary: {
      style: 'Plated 4-course dinner',
      perGuestEstimate: 60,
      highlights: ['Artisanal sourdough and truffle butter', 'Braised short rib'],
    },
    entertainmentHighlights: ['Acoustic duo', 'Custom playlist'],
    whyThisWorks: 'Balances intimacy with luxury aesthetics.',
    tradeOffs: 'Leaves smaller buffer for late favors.',
  };

  test('renders concept details, feasibility badge, and highlights', () => {
    render(
      <ConceptCard
        concept={sampleConcept}
        currency="USD"
        isSelected={false}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('Sunset Garden Gala')).toBeInTheDocument();
    expect(screen.getByText(/High-touch romantic floral celebration/i)).toBeInTheDocument();
    expect(screen.getByText('96% Feasibility')).toBeInTheDocument();
    expect(screen.getByText('USD 15,000')).toBeInTheDocument();
    expect(screen.getByText('Plated 4-course dinner (~USD 60/guest)')).toBeInTheDocument();
  });

  test('calls onSelect when select button is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <ConceptCard
        concept={sampleConcept}
        currency="USD"
        isSelected={false}
        onSelect={handleSelect}
      />
    );

    const button = screen.getByRole('button', { name: /Choose This Plan/i });
    fireEvent.click(button);
    expect(handleSelect).toHaveBeenCalledWith('concept-1');
  });

  test('renders active selection state when isSelected is true', () => {
    render(
      <ConceptCard
        concept={sampleConcept}
        currency="USD"
        isSelected={true}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('Active Selection')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selected Concept/i })).toBeInTheDocument();
  });
});
