import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#d2d2d7] rounded-[18px] p-6 shadow-sm transition-all duration-200',
        hoverEffect && 'hover:shadow-md hover:border-[#86868b] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
