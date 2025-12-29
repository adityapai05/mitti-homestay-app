"use client";

import { ShieldCheck, Clock, Trash2, User, IndianRupee } from "lucide-react";

type ListingSettingsEditorProps = {
  isVerified: boolean;
  guideAvailable: boolean;
  guideFee: number | null;
  onChange: (value: {
    guideAvailable: boolean;
    guideFee: number | null;
  }) => void;
  onRequestDelete: () => void;
};

const ListingSettingsEditor = ({
  isVerified,
  guideAvailable,
  guideFee,
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
          Manage services, verification status, and listing actions.
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
                ? "Your listing has been verified and is visible to guests."
                : "Your listing will be visible after admin verification."}
            </p>
          </div>
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
