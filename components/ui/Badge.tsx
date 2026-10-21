import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple';
}

export function Badge({ className, variant = 'gray', children, ...props }: BadgeProps) {
  const variants = {
    blue: 'bg-[#e8f2fe] text-[#0071e3] border-[#b9d9fc]',
    green: 'bg-[#eaf8ee] text-[#28a745] border-[#b5ecc1]',
    amber: 'bg-[#fef7e6] text-[#b06000] border-[#fce3a6]',
    red: 'bg-[#fdf0ef] text-[#d93025] border-[#f9c0bb]',
    gray: 'bg-[#f5f5f7] text-[#555555] border-[#d2d2d7]',
    purple: 'bg-[#f3edfd] text-[#7627bb] border-[#decbf9]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
