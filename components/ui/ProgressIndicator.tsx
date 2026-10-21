import React from 'react';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels = [],
}: ProgressIndicatorProps) {
  const currentLabel = stepLabels[currentStep - 1] || '';

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuetext={`Step ${currentStep} of ${totalSteps}${currentLabel ? `: ${currentLabel}` : ''}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
          Step {currentStep} of {totalSteps}
        </span>
        {currentLabel && (
          <span className="text-xs font-semibold text-[#1d1d1f]">
            {currentLabel}
          </span>
        )}
      </div>
      <div className="w-full bg-[#e5e5ea] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#0071e3] h-full transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(0,113,227,0.4)]"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
