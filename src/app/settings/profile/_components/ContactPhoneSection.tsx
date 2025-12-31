"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  phone: string | null;
   role: "USER" | "HOST" | "ADMIN";
  onUpdated: (contactPhone: string | null) => void;
}

export default function ContactPhoneSection({ phone, role, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(phone ?? "");
  const [saving, setSaving] = useState(false);

  async function savePhone() {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("contactPhone", value);

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
  }

  function cancelEdit() {
    setValue(phone ?? "");
    setEditing(false);
  }
  const isHost = role === "HOST";

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
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown bg-white"
            />

            <p className="text-xs text-mitti-dark-brown/60 max-w-md">
              Enter a phone number guests can use to contact you. This does not
              affect your login or account security.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={savePhone}
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
        )}
      </div>
    </section>
  );
}
