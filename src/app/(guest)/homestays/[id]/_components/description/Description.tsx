"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HomestayDetailsDTO } from "../../types";

interface DescriptionProps {
  homestay: HomestayDetailsDTO;
}

const COLLAPSE_HEIGHT = 160;

export default function Description({ homestay }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setIsCollapsible(contentRef.current.scrollHeight > COLLAPSE_HEIGHT);
  }, [homestay.description]);
  if (!homestay.description) {
    return (
      <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown">
          About this Stay
        </h2>

        <p className="text-mitti-dark-brown/70 text-base max-w-md">
          The host has not added a description yet.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        About this Stay
      </h2>

      {/* Content */}
      <div
        ref={contentRef}
        className={`relative text-mitti-dark-brown text-base leading-relaxed transition-all ${
          !expanded && isCollapsible
            ? "max-h-[160px] overflow-hidden"
            : "max-h-none"
        }`}
      >
        <p className="whitespace-pre-line text-justify">
          {homestay.description}
        </p>

        {/* Fade only if collapsible and collapsed */}
        {!expanded && isCollapsible && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-mitti-beige to-transparent" />
        )}
      </div>

      {/* Toggle only if needed */}
      {isCollapsible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 text-sm font-medium text-mitti-dark-brown underline-offset-4 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}
    </section>
  );
}
