import { Bed, Users, Clock, Home } from "lucide-react";
import { Homestay } from "@/types";
import Image from "next/image";

interface DetailsGridSectionProps {
  homestay: Homestay;
}

const DetailsGridSection: React.FC<DetailsGridSectionProps> = ({
  homestay,
}) => {
  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
            Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bed size={24} className="text-mitti-olive" />
              <span className="text-mitti-dark-brown">
                {homestay.beds} Bed{homestay.beds !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={24} className="text-mitti-olive" />
              <span className="text-mitti-dark-brown">
                {homestay.maxGuests} Guest{homestay.maxGuests !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Home size={24} className="text-mitti-olive" />{" "}
              <span className="text-mitti-dark-brown">
                Type of Stay: {homestay.type}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-mitti-olive" />
              <span className="text-mitti-dark-brown">
                Check-in: {homestay.checkInTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-mitti-olive" />
              <span className="text-mitti-dark-brown">
                Check-out: {homestay.checkOutTime}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
            Location
          </h2>
          <div className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200">
            {homestay.latitude && homestay.longitude ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* Placeholder Map Image */}
                <Image
                  src={`https://dummyimage.com/600x400?text=Map+Preview`}
                  alt="Map placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
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
