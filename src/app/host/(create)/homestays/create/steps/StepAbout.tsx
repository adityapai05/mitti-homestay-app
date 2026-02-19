"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  onChange: (value: { title: string; description: string }) => void;
};

const TITLE_MAX = 50;
const DESCRIPTION_MAX = 900;

const StepAbout = ({
  title = "",
  description = "",
  category = "",
  location = "",
  onChange,
}: Props) => {
  const [enhancing, setEnhancing] = useState(false);
  const [aiState, setAiState] = useState<
    "idle" | "generating" | "success" | "error" | "quota"
  >("idle");

  const canEnhance = description.trim().length >= 20 && !enhancing;

  const handleEnhance = async () => {
    if (!canEnhance) return;

    try {
      setEnhancing(true);
      setAiState("generating");

      const res = await fetch("/api/ai/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, category, location }),
      });

      const json = await res.json();

      if (json?.reason === "QUOTA_EXCEEDED") {
        setAiState("quota");
        return;
      }

      if (typeof json?.enhanced === "string" && json.enhanced.trim()) {
        onChange({
          title,
          description: json.enhanced.slice(0, DESCRIPTION_MAX),
        });
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
    <div className="w-full mt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Tell guests about your place
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Share what makes your home special. A warm, honest description helps
            guests feel welcome even before they arrive.
          </p>
        </div>

        {/* Title */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
            Title
          </label>
          <textarea
            value={title}
            onChange={(e) =>
              onChange({
                title: e.target.value.slice(0, TITLE_MAX),
                description,
              })
            }
            rows={2}
            className="w-full resize-none rounded-2xl border border-mitti-khaki bg-mitti-cream px-4 py-3 text-lg text-mitti-dark-brown outline-none focus:border-mitti-brown"
          />
          <div className="flex justify-end mt-1">
            <span className="text-sm text-mitti-dark-brown">
              {title.length}/{TITLE_MAX}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-mitti-dark-brown">
              Description
            </label>

            <button
              type="button"
              onClick={handleEnhance}
              disabled={!canEnhance}
              className="rounded-lg border border-mitti-khaki bg-mitti-cream px-3 py-1 text-xs text-mitti-dark-brown hover:border-mitti-brown disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
            >
              <Sparkles
                size={14}
                className={enhancing ? "animate-pulse text-mitti-brown" : ""}
              />
              {enhancing ? "Generating..." : "Enhance with AI"}
            </button>
          </div>

          <textarea
            value={description}
            onChange={(e) =>
              onChange({
                title,
                description: e.target.value.slice(0, DESCRIPTION_MAX),
              })
            }
            rows={6}
            className="w-full resize-none rounded-2xl border border-mitti-khaki bg-mitti-cream px-4 py-3 text-mitti-dark-brown outline-none focus:border-mitti-brown"
          />

          <div className="flex justify-between mt-1 text-sm text-mitti-dark-brown">
            <span>
              {description.trim().length < 20 &&
                "Enter at least 20 characters to enable AI enhancement."}
            </span>
            <span>
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </div>

          {/* AI Status */}
          <div className="mt-2 text-xs min-h-[18px]">
            {aiState === "generating" && (
              <span className="text-mitti-brown animate-pulse">
                AI is generating a refined description...
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
        </div>
      </div>
    </div>
  );
};

export default StepAbout;
