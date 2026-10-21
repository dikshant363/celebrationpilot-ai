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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          Step {currentStep} of {totalSteps}
        </span>
        {stepLabels[currentStep - 1] && (
          <span className="text-xs font-medium text-[#1d1d1f]">
            {stepLabels[currentStep - 1]}
          </span>
        )}
      </div>
      <div className="w-full bg-[#e5e5ea] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#0071e3] h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
