"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
  about: string | null;
  onUpdated: (updates: Partial<{ name: string; about: string | null }>) => void;
}

export default function BasicInfoSection({ name, about, onUpdated }: Props) {
  const [editingField, setEditingField] = useState<"name" | "about" | null>(
    null
  );

  const [nameValue, setNameValue] = useState(name);
  const [aboutValue, setAboutValue] = useState(about ?? "");
  const [saving, setSaving] = useState(false);

  async function saveField(field: "name" | "about") {
    try {
      setSaving(true);

      const formData = new FormData();
      if (field === "name") formData.append("name", nameValue);
      if (field === "about") formData.append("about", aboutValue);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      onUpdated({
        name: updated.name,
        about: updated.about,
      });

      toast.success("Profile updated");
      setEditingField(null);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Basic information
      </h2>

      {/* Name */}
      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-2">
        <span className="text-xs text-mitti-dark-brown/60">Display name</span>

        {editingField === "name" ? (
          <div className="space-y-3">
            <input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white"
            />

            <div className="flex gap-3">
              <button
                onClick={() => saveField("name")}
                disabled={saving || nameValue.trim().length < 2}
                className="rounded-lg bg-mitti-brown text-white px-4 py-2 text-sm hover:bg-mitti-dark-brown cursor-pointer disabled:opacity-60"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setNameValue(name);
                  setEditingField(null);
                }}
                className="text-sm text-mitti-brown hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-mitti-dark-brown">{name}</span>

            <button
              onClick={() => setEditingField("name")}
              className="text-sm text-mitti-brown hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* About */}
      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-2">
        <span className="text-xs text-mitti-dark-brown/60">About you</span>

        {editingField === "about" ? (
          <div className="space-y-3">
            <textarea
              value={aboutValue}
              onChange={(e) => setAboutValue(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-mitti-dark-brown/60">
                {aboutValue.length}/500
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => saveField("about")}
                  disabled={saving}
                  className="rounded-lg bg-mitti-brown text-white px-4 py-2 text-sm hover:bg-mitti-dark-brown cursor-pointer disabled:opacity-60"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setAboutValue(about ?? "");
                    setEditingField(null);
                  }}
                  className="text-sm text-mitti-brown hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-mitti-dark-brown whitespace-pre-line">
              {about || "Tell guests a little about yourself."}
            </p>

            <button
              onClick={() => setEditingField("about")}
              className="text-sm text-mitti-brown hover:underline cursor-pointer shrink-0"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
