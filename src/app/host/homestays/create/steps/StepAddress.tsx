"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

export type AddressValue = {
  country: string;
  flat?: string;
  street?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
};

type Props = {
  value?: AddressValue;
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  onChange: (value: AddressValue) => void;
};

const StepAddress = ({ value, location, onChange }: Props) => {
  const updateField = (field: keyof AddressValue, val: string) => {
    onChange({
      country: "India",
      flat: value?.flat || "",
      street: value?.street || "",
      landmark: value?.landmark || "",
      city: value?.city || "",
      district: value?.district || "",
      state: value?.state || "",
      pincode: value?.pincode || "",
      [field]: val,
    });
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Confirm your address
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Your exact address is shared only after a booking is confirmed.
          </p>
        </div>

        {/* Address form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              Country
            </label>
            <input
              value="India"
              disabled
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              House / Flat (optional)
            </label>
            <input
              value={value?.flat || ""}
              onChange={(e) => updateField("flat", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              Street (optional)
            </label>
            <input
              value={value?.street || ""}
              onChange={(e) => updateField("street", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              Landmark (optional)
            </label>
            <input
              value={value?.landmark || ""}
              onChange={(e) => updateField("landmark", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              Village / Town / City
            </label>
            <input
              value={value?.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              District (optional)
            </label>
            <input
              value={value?.district || ""}
              onChange={(e) => updateField("district", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              State
            </label>
            <input
              value={value?.state || ""}
              onChange={(e) => updateField("state", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown mb-1">
              PIN code
            </label>
            <input
              value={value?.pincode || ""}
              onChange={(e) =>
                updateField("pincode", e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-mitti-cream border border-mitti-khaki text-mitti-dark-brown"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAddress;
