"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateSchema as profileUpdateSchema } from "@/lib/validation/profileSchemas";

interface Props {
  phone: string | null;
  role: "USER" | "HOST" | "ADMIN";
  onUpdated: (contactPhone: string | null) => void;
}

const phoneSchema = profileUpdateSchema.pick({ contactPhone: true });
type PhoneValues = z.infer<typeof phoneSchema>;

export default function ContactPhoneSection({ phone, role, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const isHost = role === "HOST";

  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    mode: "onChange",
    defaultValues: { contactPhone: phone ?? "" },
  });

  useEffect(() => {
    form.reset({ contactPhone: phone ?? "" });
  }, [phone, form]);

  async function savePhone() {
    const execute = form.handleSubmit(async (values) => {
      try {
        if (saving) return;
        setSaving(true);

        const formData = new FormData();
        formData.append("contactPhone", values.contactPhone ?? "");

        const res = await fetch("/api/profile", {
          method: "PATCH",
          body: formData,
        });

        if (!res.ok) throw new Error();

        const updated = await res.json();
        onUpdated(updated.contactPhone ?? null);

        toast.success("Contact phone updated");
        setEditing(false);
      } catch {
        toast.error("Failed to update contact phone");
      } finally {
        setSaving(false);
      }
    });

    await execute();
  }

  function cancelEdit() {
    form.reset({ contactPhone: phone ?? "" });
    setEditing(false);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Contact Phone
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-3">
        {!editing ? (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-mitti-dark-brown/60">
                Phone number
              </span>

              <p className="text-sm text-mitti-dark-brown">
                {phone || "No contact phone added"}
              </p>

              <p className="text-xs text-mitti-dark-brown/60 max-w-md">
                {isHost
                  ? "This number may be shared with guests for communication. It is not used for login or verification."
                  : "This number is shown on your public profile and is not used for login or verification."}
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="text-sm text-mitti-brown hover:underline cursor-pointer shrink-0"
            >
              {phone ? "Edit" : "Add"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              {...form.register("contactPhone")}
              placeholder="+919876543210"
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white"
            />
            {form.formState.errors.contactPhone && (
              <p className="text-sm text-red-600">
                {form.formState.errors.contactPhone.message}
              </p>
            )}

            <p className="text-xs text-mitti-dark-brown/60 max-w-md">
              Enter a phone number guests can use to contact you. This does not
              affect your login or account security.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={savePhone}
                disabled={saving || !form.formState.isValid || form.formState.isSubmitting}
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
        )}
      </div>
    </section>
  );
}