import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ className, selected = false, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none border',
        selected
          ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-xs'
          : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed] hover:border-[#d2d2d7]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
