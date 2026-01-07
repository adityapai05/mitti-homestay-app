"use client";

import { ShieldCheck, ShieldHalf, ShieldX } from "lucide-react";

const policies = [
  {
    value: "FLEXIBLE",
    title: "Flexible",
    description:
      "Full refund if guest cancels at least 7 days before check-in.",
    icon: ShieldCheck,
  },
  {
    value: "MODERATE",
    title: "Moderate",
    description:
      "Full refund up to 14 days before check-in. 50% refund up to 7 days before.",
    icon: ShieldHalf,
  },
  {
    value: "STRICT",
    title: "Strict",
    description:
      "50% refund only if cancelled at least 30 days before check-in.",
    icon: ShieldX,
  },
];

type Props = {
  value?: "FLEXIBLE" | "MODERATE" | "STRICT";
  onChange: (value: "FLEXIBLE" | "MODERATE" | "STRICT") => void;
};

export default function StepCancellationPolicy({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-center w-full mt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Choose a cancellation policy
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            This determines how refunds are handled when a guest cancels.
          </p>
        </div>

        <div className="space-y-4">
          {policies.map((policy) => {
            const Icon = policy.icon;
            const isSelected = value === policy.value;

            return (
              <button
                key={policy.value}
                type="button"
                onClick={() => onChange(policy.value as "FLEXIBLE" | "MODERATE" | "STRICT")}
                className={`
                  w-full flex items-start gap-4 p-5 rounded-xl border text-left transition cursor-pointer
                  ${
                    isSelected
                      ? "border-mitti-brown bg-mitti-cream shadow-sm"
                      : "border-mitti-khaki bg-mitti-cream hover:bg-mitti-beige"
                  }
                `}
              >
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-mitti-khaki text-mitti-dark-brown">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="text-lg font-medium text-mitti-dark-brown">
                    {policy.title}
                  </p>
                  <p className="mt-1 text-sm text-mitti-dark-brown/80">
                    {policy.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
