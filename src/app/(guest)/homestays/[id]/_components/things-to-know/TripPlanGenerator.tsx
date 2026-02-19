"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

type TripPlanGeneratorProps = {
  homestayName: string;
  village: string;
  district: string;
  state: string;
  category: string;
};

export default function TripPlanGenerator({
  homestayName,
  village,
  district,
  state,
  category,
}: TripPlanGeneratorProps) {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [aiState, setAiState] = useState<
    "idle" | "generating" | "success" | "error" | "quota"
  >("idle");

  const nights = useMemo(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    if (!checkIn || !checkOut) return 2;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime()))
      return 2;

    const diffMs = outDate.getTime() - inDate.getTime();
    if (diffMs <= 0) return 2;

    return Math.max(1, Math.min(7, Math.round(diffMs / (24 * 60 * 60 * 1000))));
  }, [searchParams]);

  const handleGenerate = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setAiState("generating");

      const res = await fetch("/api/ai/trip-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homestayName,
          village,
          district,
          state,
          category,
          nights,
        }),
      });

      const json = await res.json();

      if (json?.reason === "QUOTA_EXCEEDED") {
        setAiState("quota");
        return;
      }

      if (typeof json?.plan === "string" && json.plan.trim()) {
        setPlan(json.plan);
        setAiState("success");
      } else {
        setPlan(null);
        setAiState("error");
      }
    } catch {
      setPlan(null);
      setAiState("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-mitti-khaki bg-white p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-mitti-dark-brown">
          Generate Trip Plan
        </h3>
        <p className="text-xs text-mitti-dark-brown/60">
          Plan for {nights} night{nights > 1 ? "s" : ""}.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg border border-mitti-khaki bg-mitti-cream px-3 py-1.5 text-xs text-mitti-dark-brown hover:border-mitti-brown disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
        >
          <Sparkles
            size={14}
            className={loading ? "animate-pulse text-mitti-brown" : ""}
          />
          {loading ? "Generating..." : "Generate Trip Plan"}
        </button>
      </div>

      {/* AI State Feedback */}
      <div className="text-xs min-h-[18px]">
        {aiState === "generating" && (
          <span className="text-mitti-brown animate-pulse">
            AI is creating your day-by-day itinerary...
          </span>
        )}

        {aiState === "success" && (
          <span className="text-green-700">Your trip plan is ready.</span>
        )}

        {aiState === "error" && (
          <span className="text-red-600">
            AI could not generate a plan. Please try again.
          </span>
        )}

        {aiState === "quota" && (
          <span className="text-amber-700">
            Daily AI usage limit reached. Please try again later.
          </span>
        )}

        {aiState === "idle" && !plan && (
          <span className="text-mitti-dark-brown/60">
            Get a simple day-by-day itinerary based on this location.
          </span>
        )}
      </div>

      {plan && (
        <p className="text-sm text-mitti-dark-brown/80 whitespace-pre-line leading-relaxed">
          {plan}
        </p>
      )}
    </div>
  );
}
