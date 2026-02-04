import { HomestayDetailsDTO } from "../../types";

interface TrustSignalsProps {
  homestay: HomestayDetailsDTO;
}

export default function TrustSignals({ homestay }: TrustSignalsProps) {
  const isLoved =
    homestay.rating.average >= 4.5 && homestay.rating.reviewCount >= 5;

  return (
    <section className="flex flex-wrap items-center gap-3 pt-3">
      {isLoved && (
        <span className="rounded-full bg-mitti-cream px-4 py-1.5 text-sm font-medium text-mitti-dark-brown">
          Loved by guests
        </span>
      )}

      <span className="text-sm text-mitti-dark-brown">
        <strong>{homestay.rating.average.toFixed(1)}</strong>
        <span className="text-mitti-muted">
          {" "}
          · {homestay.rating.reviewCount} reviews
        </span>
      </span>

      {homestay.meta.isVerified && (
        <span className="rounded-full bg-mitti-khaki px-3 py-1 text-sm font-medium text-mitti-dark-brown">
          MITTI verified stay
        </span>
      )}
    </section>
  );
}
