import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

/* ---------- types ---------- */

type HomestayLocation = {
  latitude: number;
  longitude: number;
  village?: string | null;
  district?: string | null;
  state?: string | null;
};

/* ---------- component ---------- */

export default function LocationSection({
  homestay,
}: {
  homestay: HomestayLocation;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-mitti-dark-brown">
        Location Evidence
      </h2>

      <div className="h-[220px] rounded-md overflow-hidden border border-mitti-khaki">
        <MapView latitude={homestay.latitude} longitude={homestay.longitude} />
      </div>

      <p className="text-sm text-mitti-dark-brown/70">
        {[homestay.village, homestay.district, homestay.state]
          .filter(Boolean)
          .join(", ") || "—"}
      </p>
    </section>
  );
}
