import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1d1d1f] tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] placeholder-[#86868b] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent',
            error && 'border-[#ff3b30] focus:ring-[#ff3b30]',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#ff3b30] font-medium">{error}</p>
        ) : helper ? (
          <p className="text-xs text-[#86868b]">{helper}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
