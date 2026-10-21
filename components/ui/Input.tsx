import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : generatedId);
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

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
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helper ? helperId : undefined}
          className={cn(
            'w-full px-4 py-2.5 text-sm bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] placeholder-[#555555] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent',
            error && 'border-[#d93025] focus:ring-[#d93025]',
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-[#d93025] font-medium">
            {error}
          </p>
        ) : helper ? (
          <p id={helperId} className="text-xs text-[#555555]">
            {helper}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
