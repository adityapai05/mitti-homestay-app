import { HomestayDetailsDTO } from "../../types";
import LocationHeader from "./LocationHeader";
import LocationMap from "./LocationMap";
import LocationNotice from "./LocationNotice";

export default function LocationOverview({
  homestay,
}: {
  homestay: HomestayDetailsDTO;
}) {
  const { location } = homestay;

  return (
    <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
      <LocationHeader location={location} />
      <LocationMap
        latitude={location.latitude}
        longitude={location.longitude}
      />
      <LocationNotice />
    </section>
  );
}
