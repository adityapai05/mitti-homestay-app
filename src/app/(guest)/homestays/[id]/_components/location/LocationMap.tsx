"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

export default function LocationMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  if (!latitude || !longitude) {
    return (
      <div className="h-[360px] rounded-2xl bg-mitti-khaki/30 flex items-center justify-center text-sm text-mitti-dark-brown">
        Location not available
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-mitti-khaki bg-mitti-beige shadow-sm">
      <MapView latitude={latitude} longitude={longitude} />

      {/* Privacy overlay ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-40 w-40 rounded-full bg-mitti-olive/10 border border-mitti-olive/30" />
      </div>
    </div>
  );
}
