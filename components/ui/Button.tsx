import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

    const variants = {
      primary:
        'bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,113,227,0.3)]',
      secondary:
        'bg-[#f5f5f7] hover:bg-[#e8e8ed] active:bg-[#dedee3] text-[#1d1d1f] border border-black/[0.04]',
      outline:
        'border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] hover:border-[#86868b] text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
      ghost:
        'bg-transparent text-[#1d1d1f] hover:bg-black/[0.05] active:bg-black/[0.08]',
      danger:
        'bg-[#ff3b30] hover:bg-[#d70015] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2 rounded-full gap-2 font-medium',
      lg: 'text-base px-6 py-2.5 rounded-full gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
