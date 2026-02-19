"use client";

import { useState } from "react";
import { IndianRupee, Sparkles } from "lucide-react";

type PricingEditorProps = {
  value: number | null;
  location?: string;
  category?: string;
  beds?: number;
  maxGuests?: number;
  amenities?: string[];
  averageLocalPrice?: number | null;
  onChange: (price: number) => void;
};

const MIN_PRICE = 150;
const MAX_PRICE = 10000;

const PricingEditor = ({
  value,
  location = "",
  category = "",
  beds = 1,
  maxGuests = 1,
  amenities = [],
  averageLocalPrice = null,
  onChange,
}: PricingEditorProps) => {
  const numericValue = value ?? 0;

  const [suggesting, setSuggesting] = useState(false);
  const [aiState, setAiState] = useState<
    "idle" | "generating" | "success" | "error" | "quota"
  >("idle");
  const [suggestionReasoning, setSuggestionReasoning] = useState<string | null>(
    null,
  );

  const isTooLow = numericValue > 0 && numericValue < MIN_PRICE;
  const isTooHigh = numericValue > MAX_PRICE;

  const isValidReasoning =
    typeof suggestionReasoning === "string" &&
    suggestionReasoning.length > 20 &&
    suggestionReasoning.trim().endsWith(".");

  const handleSuggestPrice = async () => {
    if (suggesting) return;

    try {
      setSuggesting(true);
      setAiState("generating");
      setSuggestionReasoning(null);

      const res = await fetch("/api/ai/pricing-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          category,
          beds,
          maxGuests,
          amenities,
          averageLocalPrice,
        }),
      });

      const json = await res.json();

      if (json?.reason === "QUOTA_EXCEEDED") {
        setAiState("quota");
        return;
      }

      if (
        typeof json?.suggestedPrice === "number" &&
        Number.isFinite(json.suggestedPrice)
      ) {
        onChange(Math.round(json.suggestedPrice));
        setAiState("success");
      } else {
        setAiState("error");
      }

      if (typeof json?.reasoning === "string") {
        setSuggestionReasoning(json.reasoning.trim());
      }
    } catch {
      setAiState("error");
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">Pricing</h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Set a nightly price that reflects your space and location.
        </p>
      </div>

      <div className="max-w-sm">
        <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
          Price per night
        </label>

        <button
          type="button"
          onClick={handleSuggestPrice}
          disabled={suggesting}
          className="mb-3 rounded-lg border border-mitti-khaki bg-white px-3 py-1.5 text-sm text-mitti-dark-brown hover:border-mitti-brown disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
        >
          <Sparkles
            size={16}
            className={suggesting ? "animate-pulse text-mitti-brown" : ""}
          />
          {suggesting ? "Analyzing listing..." : "Suggest price with AI"}
        </button>

        <div
          className={`
            flex items-center gap-2 rounded-xl border bg-white px-4 py-3 transition
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
            className="w-full bg-transparent outline-none text-base text-mitti-dark-brown placeholder:text-mitti-dark-brown/50"
          />
        </div>

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

        {/* AI Feedback */}
        <div className="text-xs min-h-[18px] mt-2">
          {aiState === "generating" && (
            <span className="text-mitti-brown animate-pulse">
              AI is analyzing your listing details...
            </span>
          )}

          {aiState === "success" && (
            <span className="text-green-700">
              AI suggested a price based on your listing.
            </span>
          )}

          {aiState === "error" && (
            <span className="text-red-600">
              AI could not generate a suggestion. Please try again.
            </span>
          )}

          {aiState === "quota" && (
            <span className="text-amber-700">
              Daily AI usage limit reached. Please try again later.
            </span>
          )}
        </div>

        {/* Reasoning Box */}
        {isValidReasoning && (
          <div className="mt-3 rounded-lg bg-mitti-beige px-3 py-2 text-xs text-mitti-dark-brown/80 border border-mitti-khaki">
            {suggestionReasoning}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-mitti-khaki bg-mitti-beige p-4 text-sm text-mitti-dark-brown/80">
        Tip: Homes priced realistically tend to get more early bookings and
        better reviews.
      </div>
    </section>
  );
};

export default PricingEditor;
