"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  location: {
    latitude: number;
    longitude: number;
    label: string;
  };
};

const MapConfirmModal = ({ open, onClose, onConfirm, location }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl bg-mitti-cream rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mitti-khaki">
          <h2 className="text-lg font-semibold text-mitti-dark-brown">
            Confirm your location
          </h2>
          <button
            onClick={onClose}
            className="text-mitti-dark-brown cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-mitti-dark-brown mb-4">
            This is the location guests will see before booking. Please confirm
            that the pin is correct.
          </p>

          <div className="h-80 rounded-xl overflow-hidden border border-mitti-khaki">
            <MapView
              latitude={location.latitude}
              longitude={location.longitude}
              label={location.label}
              zoom={15}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-mitti-khaki">
          <button
            onClick={onClose}
            className="px-4 py-2 text-mitti-dark-brown cursor-pointer"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-mitti-brown text-white font-medium cursor-pointer"
          >
            Looks good
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapConfirmModal;
