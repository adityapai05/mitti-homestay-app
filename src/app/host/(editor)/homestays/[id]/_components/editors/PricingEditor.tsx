"use client";

import { IndianRupee } from "lucide-react";

type PricingEditorProps = {
  value: number | null;
  onChange: (price: number) => void;
};

const MIN_PRICE = 150;
const MAX_PRICE = 10000;

const PricingEditor = ({ value, onChange }: PricingEditorProps) => {
  const numericValue = value ?? 0;

  const isTooLow = numericValue > 0 && numericValue < MIN_PRICE;
  const isTooHigh = numericValue > MAX_PRICE;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">Pricing</h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Set a nightly price that reflects your space and location.
        </p>
      </div>

      {/* Price input */}
      <div className="max-w-sm">
        <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
          Price per night
        </label>

        <div
          className={`
            flex items-center gap-2 rounded-xl border bg-white px-4 py-3
            transition
            ${
              isTooLow || isTooHigh
                ? "border-red-500"
                : "border-mitti-khaki hover:border-mitti-brown focus-within:border-mitti-brown"
            }
          `}
        >
          <IndianRupee size={18} className="text-mitti-dark-brown/70" />

          <input
            type="number"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={50}
            value={numericValue === 0 ? "" : numericValue}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="e.g. 2500"
            className="
              w-full bg-transparent outline-none
              text-base text-mitti-dark-brown
              placeholder:text-mitti-dark-brown/50
              cursor-text
            "
          />
        </div>

        {/* Helper text */}
        <div className="mt-2 text-sm">
          {isTooLow && (
            <p className="text-red-600">
              Minimum price is ₹{MIN_PRICE} per night.
            </p>
          )}

          {isTooHigh && (
            <p className="text-red-600">
              Maximum price is ₹{MAX_PRICE} per night.
            </p>
          )}

          {!isTooLow && !isTooHigh && (
            <p className="text-mitti-dark-brown/70">
              Guests will see this as the base nightly price.
            </p>
          )}
        </div>
      </div>

      {/* Context hint */}
      <div className="rounded-lg border border-mitti-khaki bg-mitti-beige p-4 text-sm text-mitti-dark-brown/80">
        Tip: Homes priced realistically tend to get more early bookings and
        better reviews.
      </div>
    </section>
  );
};

export default PricingEditor;
