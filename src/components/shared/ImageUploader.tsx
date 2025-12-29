"use client";

import { useRef, useState } from "react";
import {
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function ImageUploader({
  max = 6,
  value,
  onChange,
}: {
  max?: number;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (value.length + files.length > max) {
      setError(`You can upload a maximum of ${max} images`);
      return;
    }

    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    setUploading(true);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.urls?.length) {
        onChange([...value, ...data.urls]);
      }

      if (data.errors?.length) {
        setError(data.errors.join(" • "));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Image upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...value];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload box */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-mitti-khaki rounded-2xl p-10 bg-mitti-cream cursor-pointer hover:bg-mitti-beige transition"
      >
        {uploading ? (
          <Loader2 className="text-mitti-dark-brown animate-spin" size={28} />
        ) : (
          <Upload className="text-mitti-dark-brown" size={28} />
        )}

        <p className="font-medium text-mitti-dark-brown">
          {uploading ? "Uploading images…" : "Click to upload images"}
        </p>
        <p className="text-sm text-mitti-dark-brown">
          JPG or PNG, minimum 50 KB, up to {max} photos
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-center text-mitti-error">{error}</p>}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden border border-mitti-khaki bg-mitti-beige"
            >
              <Image
                src={url}
                alt="Homestay"
                fill
                className="h-full w-full object-cover"
              />

              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-mitti-brown text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <ImageIcon size={12} />
                  Cover
                </div>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 bg-mitti-cream rounded-full p-1 text-mitti-dark-brown hover:scale-105 transition cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Reorder controls */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  type="button"
                  onClick={() => moveImage(index, "left")}
                  disabled={index === 0}
                  className="bg-mitti-cream p-1 rounded-full text-mitti-dark-brown disabled:opacity-30 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, "right")}
                  disabled={index === value.length - 1}
                  className="bg-mitti-cream p-1 rounded-full text-mitti-dark-brown disabled:opacity-30 cursor-pointer"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
