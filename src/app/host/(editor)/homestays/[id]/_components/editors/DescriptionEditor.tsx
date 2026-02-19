"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type DescriptionEditorProps = {
  value: string;
  category?: string;
  location?: string;
  onChange: (description: string) => void;
};

const DESCRIPTION_MAX = 900;

const DescriptionEditor = ({
  value,
  category = "",
  location = "",
  onChange,
}: DescriptionEditorProps) => {
  const [enhancing, setEnhancing] = useState(false);
  const [aiState, setAiState] = useState<
    "idle" | "generating" | "success" | "error" | "quota"
  >("idle");

  const canEnhance = value.trim().length >= 20 && !enhancing;

  const handleEnhance = async () => {
    if (!canEnhance) return;

    try {
      setEnhancing(true);
      setAiState("generating");

      const res = await fetch("/api/ai/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value, category, location }),
      });

      const json = await res.json();

      if (json?.reason === "QUOTA_EXCEEDED") {
        setAiState("quota");
        return;
      }

      if (typeof json?.enhanced === "string" && json.enhanced.trim()) {
        onChange(json.enhanced.slice(0, DESCRIPTION_MAX));
        setAiState("success");
      } else {
        setAiState("error");
      }
    } catch {
      setAiState("error");
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Description
        </h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Help guests imagine their stay. Share the atmosphere, surroundings,
          and what makes your place special.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleEnhance}
          disabled={!canEnhance}
          className="rounded-lg border border-mitti-khaki bg-white px-3 py-1.5 text-sm text-mitti-dark-brown hover:border-mitti-brown disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
        >
          <Sparkles
            size={16}
            className={enhancing ? "animate-pulse text-mitti-brown" : ""}
          />
          {enhancing ? "Generating..." : "Enhance with AI"}
        </button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, DESCRIPTION_MAX))}
          rows={8}
          className="
            w-full resize-none rounded-xl
            border border-mitti-khaki
            bg-white px-4 py-3
            text-sm sm:text-base text-mitti-dark-brown
            outline-none transition
            focus:border-mitti-brown
            hover:border-mitti-brown
            cursor-text
          "
        />

        <div className="absolute bottom-2 right-3 text-xs text-mitti-dark-brown/60">
          {value.length}/{DESCRIPTION_MAX}
        </div>
      </div>

      <div className="text-xs min-h-[18px]">
        {value.trim().length < 20 && (
          <span className="text-mitti-dark-brown/60">
            Enter at least 20 characters to enable AI enhancement.
          </span>
        )}

        {aiState === "generating" && (
          <span className="text-mitti-brown animate-pulse">
            AI is refining your description...
          </span>
        )}

        {aiState === "success" && (
          <span className="text-green-700">
            AI generated an improved version. You can edit it further.
          </span>
        )}

        {aiState === "error" && (
          <span className="text-red-600">
            AI could not generate a description. Please try again.
          </span>
        )}

        {aiState === "quota" && (
          <span className="text-amber-700">
            Daily AI usage limit reached. Please try again later.
          </span>
        )}
      </div>

      <div className="text-sm text-mitti-dark-brown/70 space-y-1">
        <p>Good descriptions usually include:</p>
        <ul className="list-disc list-inside">
          <li>What the surroundings feel like</li>
          <li>Who the place is ideal for</li>
          <li>Any unique experiences guests can expect</li>
        </ul>
      </div>
    </section>
  );
};

export default DescriptionEditor;
