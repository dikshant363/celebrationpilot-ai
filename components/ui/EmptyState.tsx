import React, { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center text-[#0071e3] mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1.5 tracking-tight">{title}</h3>
      <p className="text-sm text-[#515154] mb-6 leading-relaxed max-w-sm">{description}</p>
      {actionText &&
        (actionHref ? (
          <Link href={actionHref}>
            <Button variant="primary">{actionText}</Button>
          </Link>
        ) : onAction ? (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        ) : null)}
    </div>
  );
}
