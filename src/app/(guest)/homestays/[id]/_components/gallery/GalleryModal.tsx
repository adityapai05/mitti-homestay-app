"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  name: string;
}

export default function GalleryModal({
  open,
  onClose,
  images,
  name,
}: GalleryModalProps) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const scrollToImage = (index: number) => {
    imageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!open) return null;

  return (
    <div className="min-h-screen fixed inset-0 z-50 bg-mitti-beige flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-mitti-khaki bg-mitti-beige px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-mitti-cream transition"
        >
          <ArrowLeft className="h-5 w-5 text-mitti-dark-brown" />
        </button>

        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Stay gallery
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 space-y-10">
          {/* Preview strip */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border border-mitti-khaki"
              >
                <Image
                  src={img}
                  alt={`${name} preview ${index + 1}`}
                  fill
                  className="object-cover hover:brightness-90 transition"
                />
              </button>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-8">
            {images.map((img, index) => (
              <div
                key={index}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className="rounded-xl shadow-sm"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={img}
                    alt={`${name} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
