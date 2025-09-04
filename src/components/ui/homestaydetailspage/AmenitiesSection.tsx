import { Wifi, Coffee, ShowerHead, PersonStanding } from "lucide-react";
import { Homestay } from "@/types";

interface AmenitiesSectionProps {
  homestay: Homestay;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ homestay }) => {
  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={24} className="text-mitti-olive" />,
    "Hot Water": <ShowerHead size={24} className="text-mitti-olive" />,
    "Organic Meals": <Coffee size={24} className="text-mitti-olive" />,
    // Add more mappings as needed
  };

  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
          Amenities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homestay.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3">
              {amenityIcons[amenity] || (
                <span className="text-mitti-olive">•</span>
              )}
              <span className="text-mitti-dark-brown">{amenity}</span>
            </div>
          ))}
          {homestay.guideAvailable && (
            <div className="flex items-center gap-3 rounded-lg">
              <span className="text-mitti-olive">
                <PersonStanding />{" "}
              </span>
              <span className="text-mitti-dark-brown">
                Local Guide Available
                {homestay.guideFee ? ` for ₹${homestay.guideFee}/day` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
