"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface Props {
  image: string | null;
  onUpdated: (image: string | null) => void;
}

export default function ProfilePhotoSection({ image, onUpdated }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      onUpdated(updated.image ?? null);

      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to update profile photo");
    } finally {
      setUploading(false);
    }
  }

  function handleSelectFile() {
    fileInputRef.current?.click();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Profile photo
      </h2>

      <div className="relative w-fit">
        <div className="relative h-52 w-52 rounded-full overflow-hidden border border-mitti-khaki bg-mitti-beige">
          {image ? (
            <Image
              src={image}
              alt="Profile photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-mitti-dark-brown/60">
              No photo
            </div>
          )}
        </div>

        {/* Edit button */}
        <button
          onClick={handleSelectFile}
          disabled={uploading}
          className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-mitti-brown text-white text-xs flex items-center justify-center shadow hover:bg-mitti-dark-brown transition cursor-pointer disabled:opacity-60"
        >
          {uploading ? "…" : <Edit size="20" />}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
        />
      </div>

      <p className="text-xs text-mitti-dark-brown/60 max-w-xs">
        Choose a clear photo of yourself. This helps others recognize you on
        MITTI.
      </p>
    </section>
  );
}
