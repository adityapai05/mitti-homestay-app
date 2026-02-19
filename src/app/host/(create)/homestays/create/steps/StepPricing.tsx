"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  value?: number;
  location?: string;
  category?: string;
  beds?: number;
  maxGuests?: number;
  amenities?: string[];
  averageLocalPrice?: number | null;
  onChange: (value: number) => void;
};

const MIN_PRICE = 150;
const MAX_PRICE = 10000;

const StepPricing = ({
  value,
  location = "",
  category = "",
  beds = 1,
  maxGuests = 1,
  amenities = [],
  averageLocalPrice = null,
  onChange,
}: Props) => {
  const [suggesting, setSuggesting] = useState(false);
  const [aiState, setAiState] = useState<
    "idle" | "generating" | "success" | "error" | "quota"
  >("idle");
  const [suggestionReasoning, setSuggestionReasoning] = useState<string | null>(
    null,
  );

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
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Set your price per night
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Choose a fair price for your home. You can always change it later.
          </p>
        </div>

        <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
          <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
            Price per night (INR)
          </label>

          <button
            type="button"
            onClick={handleSuggestPrice}
            disabled={suggesting}
            className="mb-3 rounded-lg border border-mitti-khaki bg-mitti-cream px-3 py-1.5 text-sm text-mitti-dark-brown hover:border-mitti-brown disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
          >
            <Sparkles
              size={16}
              className={suggesting ? "animate-pulse text-mitti-brown" : ""}
            />
            {suggesting ? "Generating suggestion..." : "Suggest price with AI"}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xl font-medium text-mitti-dark-brown">
              Rs.
            </span>
            <input
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={value ?? ""}
              onChange={(e) => onChange(Number(e.target.value))}
              placeholder="e.g. 2500"
              className="w-full px-4 py-3 rounded-xl bg-mitti-beige border border-mitti-khaki text-lg text-mitti-dark-brown outline-none focus:border-mitti-brown"
            />
          </div>

          <div className="mt-2 text-xs min-h-[18px]">
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

          {isValidReasoning && (
            <div className="mt-3 rounded-lg bg-mitti-beige px-3 py-2 text-xs text-mitti-dark-brown/80 border border-mitti-khaki">
              {suggestionReasoning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPricing;
