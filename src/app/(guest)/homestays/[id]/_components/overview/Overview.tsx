import Image from "next/image";
import { Star, ShieldCheck } from "lucide-react";
import { HomestayDetailsDTO } from "../../types";

interface OverviewProps {
  homestay: HomestayDetailsDTO;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < fullStars
              ? "text-mitti-olive fill-mitti-olive"
              : "text-mitti-dark-brown"
          }`}
        />
      ))}
    </div>
  );
}

export default function Overview({ homestay }: OverviewProps) {
  const locationText = [homestay.location.village, homestay.location.state]
    .filter(Boolean)
    .join(", ");

  const categoryLabel = toTitleCase(homestay.category.replace("_", " "));

  const stayTypeLabel =
    homestay.type === "ROOM" ? "Private Room" : "Entire Home";

  return (
    <section className="max-w-4xl px-4 space-y-6">
      {/* Title */}
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-3xl lg:text-4xl font-semibold text-mitti-dark-brown">
          {homestay.name}
        </h1>

        <p className="text-base font-medium text-mitti-dark-brown">
          {locationText}
        </p>

        <p className="text-sm text-mitti-dark-brown">
          {stayTypeLabel} · {homestay.capacity.bedrooms} Bedroom ·{" "}
          {categoryLabel}
        </p>
      </div>

      {/* Trust Card */}
      <div
        className="rounded-2xl border border-mitti-khaki bg-mitti-beige p-6 shadow-sm"
      >
        <div className="grid grid-cols-3 items-center text-center">
          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-semibold text-mitti-dark-brown">
              {homestay.rating.average.toFixed(1)}
            </span>
            <RatingStars rating={homestay.rating.average} />
          </div>

          {/* Reviews */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-semibold text-mitti-dark-brown">
              {homestay.rating.reviewCount}
            </span>
            <span className="text-sm text-mitti-dark-brown">Reviews</span>
          </div>

          {/* Verified */}
          <div className="flex flex-col items-center gap-1">
            {homestay.meta.isVerified ? (
              <>
                <ShieldCheck className="h-6 w-6 text-mitti-olive" />
                <span className="text-sm font-medium text-mitti-olive">
                  MITTI Verified
                </span>
              </>
            ) : (
              <span className="text-sm text-mitti-dark-brown">Unverified</span>
            )}
          </div>
        </div>
      </div>

      {/* Host */}
      <div className="flex items-center gap-4 justify-center sm:justify-start text-center sm:text-left">
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-mitti-khaki">
          {homestay.host.image && (
            <Image
              src={homestay.host.image}
              alt={homestay.host.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div>
          <p className="font-medium text-mitti-dark-brown">
            Hosted By {homestay.host.name}
          </p>
          <p className="text-sm text-mitti-dark-brown">
            {stayTypeLabel} · Shared Spaces
          </p>
        </div>
      </div>
    </section>
  );
}
