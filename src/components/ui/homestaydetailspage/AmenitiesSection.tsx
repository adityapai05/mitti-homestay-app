"use client";

import {
  Wifi,
  Coffee,
  ShowerHead,
  PersonStanding,
  Utensils,
  AirVent,
  Car,
  Tv,
  Waves,
  Bed,
  Bath,
  Ban,
} from "lucide-react";
import { Homestay } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/prebuilt-components/collapsible";
import { Button } from "@/components/ui/prebuilt-components/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AmenitiesSectionProps {
  homestay: Homestay;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ homestay }) => {
  const [isOpen, setIsOpen] = useState(false);

  const amenityIcons: Record<string, React.ReactNode> = {
    "Wi-Fi": <Wifi size={20} className="text-mitti-olive" />,
    "Hot Water": <ShowerHead size={20} className="text-mitti-olive" />,
    "Organic Meals": <Coffee size={20} className="text-mitti-olive" />,
    Kitchen: <Utensils size={20} className="text-mitti-olive" />,
    "Air Conditioning": <AirVent size={20} className="text-mitti-olive" />,
    Parking: <Car size={20} className="text-mitti-olive" />,
    TV: <Tv size={20} className="text-mitti-olive" />,
    Pool: <Waves size={20} className="text-mitti-olive" />,
    Bedding: <Bed size={20} className="text-mitti-olive" />,
    Bathroom: <Bath size={20} className="text-mitti-olive" />,
  };

  console.log(homestay.amenities);
  const visibleAmenities = homestay.amenities?.slice(0, 6) || [];
  const hiddenAmenities = homestay.amenities?.slice(6) || [];
  const showCollapsible = homestay.amenities?.length > 6;

  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-2">
          Amenities
        </h2>
        {homestay.amenities?.length > 0 || homestay.guideAvailable ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="grid grid-cols-1 sm:grid-cols-2 ">
              {visibleAmenities.map((amenity, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "hover:bg-mitti-khaki/10 transition-all duration-200",
                    "text-mitti-dark-brown"
                  )}
                >
                  {amenityIcons[amenity] || (
                    <span className="text-mitti-olive text-lg">•</span>
                  )}
                  <span className="text-lg">{amenity}</span>
                </div>
              ))}
              {isOpen &&
                hiddenAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      "hover:bg-mitti-khaki/10 transition-all duration-200",
                      "text-mitti-dark-brown"
                    )}
                  >
                    {amenityIcons[amenity] || (
                      <span className="text-mitti-olive text-lg">•</span>
                    )}
                    <span className="text-lg">{amenity}</span>
                  </div>
                ))}
              {(isOpen || !showCollapsible) && homestay.guideAvailable && (
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "text-mitti-dark-brown"
                  )}
                >
                  <PersonStanding size={20} className="text-mitti-olive" />
                  <span className="text-lg">
                    Local Guide Available
                    {homestay.guideFee ? ` for ₹${homestay.guideFee}/day` : ""}
                  </span>
                </div>
              )}
            </div>
            {showCollapsible && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 mt-4 bg-mitti-brown  text-mitti-beige  border-mitti-khaki hover:bg-mitti-dark-brown hover:text-mitti-beige transition-all duration-200 font-medium rounded-full"
                  )}
                  aria-label={isOpen ? "Show less" : "Show more"}
                >
                  {isOpen ? (
                    <>
                      Show Less{" "}
                      <ChevronUp size={18} className="text-mitti-beige" />
                    </>
                  ) : (
                    <>
                      Show More{" "}
                      <ChevronDown size={18} className="text-mitti-beige" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <div className="h-4" />
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="flex flex-col items-center text-center p-6 bg-mitti-khaki/10 rounded-lg">
            <Ban size={40} className="text-mitti-olive mb-4" />
            <p className="text-mitti-dark-brown text-lg font-semibold">
              No Amenities Listed
            </p>
            <p className="text-mitti-dark-brown/70 text-base mt-2 max-w-md">
              This homestay has not provided any amenities information.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AmenitiesSection;
