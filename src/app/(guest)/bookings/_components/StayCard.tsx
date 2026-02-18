import Image from "next/image";
import StayStatusPill from "./StayStatusPill";
import { Stay } from "./types";
import SmartLink from "@/components/shared/SmartLink";

export default function StayCard({ stay }: { stay: Stay }) {
  const image = stay.homestay.imageUrl[0];

  return (
    <SmartLink
      href={`/bookings/${stay.id}`}
      className="block rounded-xl border border-mitti-khaki bg-white hover:bg-mitti-cream transition cursor-pointer"
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-28 rounded-lg overflow-hidden bg-mitti-beige shrink-0">
          {image && (
            <Image
              src={image}
              alt={stay.homestay.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-medium text-mitti-dark-brown truncate">
            {stay.homestay.name}
          </h3>

          <p className="text-sm text-mitti-dark-brown/60">
            {stay.homestay.displayAddress}
          </p>

          <p className="text-sm text-mitti-dark-brown/70">
            {new Date(stay.checkIn).toLocaleDateString()} –{" "}
            {new Date(stay.checkOut).toLocaleDateString()} · {stay.nights}{" "}
            nights
          </p>
        </div>

        <StayStatusPill stay={stay} />
      </div>
    </SmartLink>
  );
}
