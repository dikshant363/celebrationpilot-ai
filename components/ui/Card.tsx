import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#e5e5ea] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200',
        hoverEffect &&
          'hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#d2d2d7] hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
