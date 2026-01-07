"use client";

import {
  ShieldCheck,
  Clock,
  Trash2,
  User,
  IndianRupee,
  Shield,
} from "lucide-react";

type CancellationPolicy = "FLEXIBLE" | "MODERATE" | "STRICT";

type ListingSettingsEditorProps = {
  isVerified: boolean;
  guideAvailable: boolean;
  guideFee: number | null;
  cancellationPolicy: CancellationPolicy;
  onChange: (value: {
    guideAvailable: boolean;
    guideFee: number | null;
    cancellationPolicy: CancellationPolicy;
  }) => void;
  onRequestDelete: () => void;
};

const POLICY_COPY: Record<
  CancellationPolicy,
  { title: string; description: string }
> = {
  FLEXIBLE: {
    title: "Flexible",
    description:
      "Guests get a full refund if they cancel at least 7 days before check-in.",
  },
  MODERATE: {
    title: "Moderate",
    description:
      "Guests get a full refund up to 14 days before check-in, and a 50% refund up to 7 days before.",
  },
  STRICT: {
    title: "Strict",
    description:
      "Guests get a 50% refund only if they cancel at least 30 days before check-in.",
  },
};

const ListingSettingsEditor = ({
  isVerified,
  guideAvailable,
  guideFee,
  cancellationPolicy,
  onChange,
  onRequestDelete,
}: ListingSettingsEditorProps) => {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Listing settings
        </h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Manage policies, services, and listing actions.
        </p>
      </div>

      {/* Verification */}
      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream p-4">
        <div className="flex items-start gap-3">
          {isVerified ? (
            <ShieldCheck className="text-mitti-olive mt-1" size={20} />
          ) : (
            <Clock className="text-mitti-dark-brown mt-1" size={20} />
          )}

          <div>
            <p className="font-medium text-mitti-dark-brown">
              {isVerified ? "Verified listing" : "Pending verification"}
            </p>
            <p className="text-sm text-mitti-dark-brown/70">
              {isVerified
                ? "Your listing is live and visible to guests."
                : "Your listing will be visible after admin verification."}
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation policy */}
      <div className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="mt-1 text-mitti-dark-brown" />
          <div>
            <p className="font-medium text-mitti-dark-brown">
              Cancellation policy
            </p>
            <p className="text-sm text-mitti-dark-brown/70">
              This policy applies to all guest cancellations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(POLICY_COPY) as CancellationPolicy[]).map((policy) => {
            const selected = cancellationPolicy === policy;

            return (
              <button
                key={policy}
                type="button"
                onClick={() =>
                  onChange({
                    guideAvailable,
                    guideFee,
                    cancellationPolicy: policy,
                  })
                }
                className={`
                  rounded-xl border p-4 text-left transition cursor-pointer
                  ${
                    selected
                      ? "border-mitti-brown bg-mitti-beige"
                      : "border-mitti-khaki bg-white hover:border-mitti-brown/50"
                  }
                `}
              >
                <p className="font-medium text-mitti-dark-brown">
                  {POLICY_COPY[policy].title}
                </p>
                <p className="mt-1 text-sm text-mitti-dark-brown/70">
                  {POLICY_COPY[policy].description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide service */}
      <div className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-4">
        <div className="flex items-center gap-3">
          <User size={18} />
          <div>
            <p className="font-medium text-mitti-dark-brown">
              Local guide service
            </p>
            <p className="text-sm text-mitti-dark-brown/70">
              Offer a local guide to guests during their stay.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Guide available</span>
          <input
            type="checkbox"
            checked={guideAvailable}
            onChange={(e) =>
              onChange({
                guideAvailable: e.target.checked,
                guideFee: e.target.checked ? guideFee : null,
                cancellationPolicy,
              })
            }
            className="h-5 w-5 cursor-pointer"
          />
        </div>

        {guideAvailable && (
          <div>
            <label className="block text-sm mb-1 text-mitti-dark-brown">
              Guide fee (per day)
            </label>
            <div className="flex items-center gap-2">
              <IndianRupee size={16} />
              <input
                type="number"
                min={0}
                value={guideFee ?? ""}
                onChange={(e) =>
                  onChange({
                    guideAvailable: true,
                    guideFee: e.target.value ? Number(e.target.value) : null,
                    cancellationPolicy,
                  })
                }
                className="w-40 rounded-lg border px-3 py-2"
                placeholder="e.g. 500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <Trash2 size={20} className="text-red-600 mt-1" />
          <div className="flex-1">
            <p className="font-medium text-red-700">Delete listing</p>
            <p className="text-sm text-red-600 mb-3">
              This action cannot be undone. Active bookings will prevent
              deletion.
            </p>

            <button
              type="button"
              onClick={onRequestDelete}
              className="w-full flex items-center gap-2 rounded-lg border border-red-200
              bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100 cursor-pointer"
            >
              <Trash2 size={16} />
              Remove listing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingSettingsEditor;
