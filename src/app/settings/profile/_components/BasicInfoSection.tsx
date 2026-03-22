"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateSchema as profileUpdateSchema } from "@/lib/validation/profileSchemas";

interface Props {
  name: string;
  about: string | null;
  onUpdated: (updates: Partial<{ name: string; about: string | null }>) => void;
}

const nameSchema = profileUpdateSchema.pick({ name: true });
const aboutSchema = profileUpdateSchema.pick({ about: true });

type NameValues = z.infer<typeof nameSchema>;
type AboutValues = z.infer<typeof aboutSchema>;

export default function BasicInfoSection({ name, about, onUpdated }: Props) {
  const [editingField, setEditingField] = useState<"name" | "about" | null>(null);
  const [saving, setSaving] = useState(false);

  const nameForm = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    mode: "onChange",
    defaultValues: { name },
  });

  const aboutForm = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    mode: "onChange",
    defaultValues: { about: about ?? "" },
  });

  useEffect(() => {
    nameForm.reset({ name });
  }, [name, nameForm]);

  useEffect(() => {
    aboutForm.reset({ about: about ?? "" });
  }, [about, aboutForm]);

  async function saveField(field: "name" | "about") {
    const execute =
      field === "name"
        ? nameForm.handleSubmit(async (values) => {
            await submitProfilePatch(values);
          })
        : aboutForm.handleSubmit(async (values) => {
            await submitProfilePatch(values);
          });

    await execute();
  }

  async function submitProfilePatch(values: Partial<{ name: string; about: string }>) {
    try {
      if (saving) return;
      setSaving(true);

      const formData = new FormData();
      if (typeof values.name === "string") formData.append("name", values.name);
      if (typeof values.about === "string") formData.append("about", values.about);

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
              {...nameForm.register("name")}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white"
            />
            {nameForm.formState.errors.name && (
              <p className="text-sm text-red-600">{nameForm.formState.errors.name.message}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => saveField("name")}
                disabled={saving || !nameForm.formState.isValid || nameForm.formState.isSubmitting}
                className="rounded-lg bg-mitti-brown text-white px-4 py-2 text-sm hover:bg-mitti-dark-brown cursor-pointer disabled:opacity-60"
              >
                Save
              </button>

              <button
                onClick={() => {
                  nameForm.reset({ name });
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
              {...aboutForm.register("about")}
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white resize-none"
            />
            {aboutForm.formState.errors.about && (
              <p className="text-sm text-red-600">{aboutForm.formState.errors.about.message}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-mitti-dark-brown/60">
                {(aboutForm.watch("about") ?? "").length}/500
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => saveField("about")}
                  disabled={saving || !aboutForm.formState.isValid || aboutForm.formState.isSubmitting}
                  className="rounded-lg bg-mitti-brown text-white px-4 py-2 text-sm hover:bg-mitti-dark-brown cursor-pointer disabled:opacity-60"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    aboutForm.reset({ about: about ?? "" });
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