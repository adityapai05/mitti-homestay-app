"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Props {
  languages: string[];
  onUpdated: (languages: string[]) => void;
}

export default function LanguagesSection({ languages, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<string[]>(languages);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  function addLanguage(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (values.includes(trimmed)) return;

    setValues((prev) => [...prev, trimmed]);
    setInput("");
  }

  function removeLanguage(lang: string) {
    setValues((prev) => prev.filter((l) => l !== lang));
  }

  async function saveLanguages() {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("languages", JSON.stringify(values));

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      onUpdated(updated.languages ?? []);

      toast.success("Languages updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update languages");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setValues(languages);
    setInput("");
    setEditing(false);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Languages spoken
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-4">
        {!editing ? (
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {languages.length > 0 ? (
                languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-mitti-beige px-3 py-1 text-xs text-mitti-dark-brown"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-sm text-mitti-dark-brown/60">
                  No languages added
                </span>
              )}
            </div>

            <button
              onClick={() => setEditing(true)}
              className="text-sm text-mitti-brown hover:underline cursor-pointer shrink-0"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {values.map((lang) => (
                <span
                  key={lang}
                  className="flex items-center gap-1 rounded-full bg-mitti-beige px-3 py-1 text-xs text-mitti-dark-brown"
                >
                  {lang}
                  <button
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-mitti-brown cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLanguage(input);
                }
              }}
              placeholder="Type a language and press Enter"
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white"
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-mitti-dark-brown/60 max-w-sm">
                Add languages you can comfortably communicate in with guests.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={saveLanguages}
                  disabled={saving}
                  className="rounded-lg bg-mitti-brown text-white px-4 py-2 text-sm hover:bg-mitti-dark-brown cursor-pointer disabled:opacity-60"
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  className="text-sm text-mitti-brown hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
