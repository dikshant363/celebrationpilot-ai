import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple';
}

export function Badge({ className, variant = 'gray', children, ...props }: BadgeProps) {
  const variants = {
    blue: 'bg-[#e8f2fe] text-[#0071e3] border-[#b9d9fc]',
    green: 'bg-[#eaf8ee] text-[#248a3d] border-[#b5ecc1]',
    amber: 'bg-[#fef7e6] text-[#b26a00] border-[#fce3a6]',
    red: 'bg-[#fdf0ef] text-[#d70015] border-[#f9c0bb]',
    gray: 'bg-[#f5f5f7] text-[#515154] border-[#e5e5ea]',
    purple: 'bg-[#f3edfd] text-[#7627bb] border-[#decbf9]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
