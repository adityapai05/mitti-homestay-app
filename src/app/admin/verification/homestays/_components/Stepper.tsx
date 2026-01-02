"use client";

import { cn } from "@/lib/utils";

export default function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="px-6 pt-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex-1 flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border",
                    isCompleted &&
                      "bg-mitti-olive border-mitti-olive text-white",
                    isActive &&
                      "border-mitti-olive text-mitti-olive bg-mitti-beige",
                    !isActive &&
                      !isCompleted &&
                      "border-mitti-khaki text-mitti-dark-brown/60"
                  )}
                >
                  {index + 1}
                </div>

                <span
                  className={cn(
                    "mt-2 text-xs text-center",
                    isActive
                      ? "text-mitti-dark-brown font-medium"
                      : "text-mitti-dark-brown/60"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2",
                    isCompleted ? "bg-mitti-olive" : "bg-mitti-khaki"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
