import { MapPin } from "lucide-react";
import { HomestayDetailsDTO } from "../../types";

type Location = HomestayDetailsDTO["location"];

export default function LocationHeader({ location }: { location: Location }) {
  const locationText = [location.village, location.district, location.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        Where You'll Be
      </h2>

      <div className="flex items-center gap-2 text-mitti-dark-brown/70">
        <MapPin className="h-4 w-4 text-mitti-olive" />
        <span className="text-sm">{locationText}</span>
      </div>
    </div>
  );
}
