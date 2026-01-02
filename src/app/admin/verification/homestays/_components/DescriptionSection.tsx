import { Utensils, Droplet, Fan, Zap, PlusCircle } from "lucide-react";

const AMENITY_ICONS: Record<string, any> = {
  home_food: Utensils,
  drinking_water: Droplet,
  fan: Fan,
  electricity: Zap,
  first_aid: PlusCircle,
};

function formatAmenity(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DescriptionSection({ homestay }: { homestay: any }) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-mitti-dark-brown">
        Description & Amenities
      </h2>

      <p className="text-sm leading-relaxed text-mitti-dark-brown/80">
        {homestay.description}
      </p>

      <div className="flex flex-wrap gap-3">
        {homestay.amenities.map((amenity: string) => {
          const Icon = AMENITY_ICONS[amenity] || PlusCircle;
          return (
            <span
              key={amenity}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-mitti-khaki bg-mitti-beige text-sm text-mitti-dark-brown"
            >
              <Icon size={14} />
              {formatAmenity(amenity)}
            </span>
          );
        })}
      </div>
    </section>
  );
}
