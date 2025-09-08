// src/components/ui/homestaydetailspage/DetailsGridSection.tsx
import { Bed, Users, Clock, Home } from "lucide-react";
import { Homestay } from "@/types";
import dynamic from "next/dynamic";

interface DetailsGridSectionProps {
  homestay: Homestay;
}
const MapView = dynamic(() => import("./MapView"), { ssr: false });
const DetailsGridSection: React.FC<DetailsGridSectionProps> = ({
  homestay,
}) => {
  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
            Details
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-mitti-dark-brown">
            <div className="flex items-center gap-2">
              <Bed size={20} className="text-mitti-olive" />
              <span>
                {homestay.beds} Bed{homestay.beds !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-mitti-olive" />
              <span>
                Max: {" "} 
                {homestay.maxGuests} Guest{homestay.maxGuests !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home size={20} className="text-mitti-olive" />
              <span>Type: {homestay.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-mitti-olive" />
              <span>Check-in: {homestay.checkInTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-mitti-olive" />
              <span>Check-out: {homestay.checkOutTime}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-2">
            Location
          </h2>
          <p className="text-mitti-dark-brown mb-4">
            {homestay.address || "Location not specified"}
          </p>
          <div className="relative h-[32rem] w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-200">
            {homestay.latitude && homestay.longitude ? (
              <MapView
                latitude={homestay.latitude}
                longitude={homestay.longitude}
                name={homestay.name}
              />
            ) : (
              <span className="text-mitti-dark-brown">
                Location not available
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsGridSection;
