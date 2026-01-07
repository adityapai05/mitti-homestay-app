import { format } from "date-fns";
import Link from "next/link";
import type { CancellationPolicy } from "@prisma/client";

interface BookingDetailsProps {
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  guideAvailable: boolean;
  cancellationPolicy: CancellationPolicy;
  host: {
    name: string;
    phone: string | null;
    email: string | null;
  };
}

function getPolicyCopy(policy: CancellationPolicy) {
  switch (policy) {
    case "FLEXIBLE":
      return {
        title: "Flexible cancellation",
        description:
          "Cancel 7 days or more before check-in for a full refund. No refund for cancellations made less than 7 days before check-in.",
      };

    case "MODERATE":
      return {
        title: "Moderate cancellation",
        description:
          "Cancel 14 days or more before check-in for a full refund. Cancel 7 to 13 days before check-in for a 50% refund. No refund for cancellations made less than 7 days before check-in.",
      };

    case "STRICT":
      return {
        title: "Strict cancellation",
        description:
          "Cancel 30 days or more before check-in for a 50% refund. No refund for cancellations made less than 30 days before check-in.",
      };

    default:
      return {
        title: "Cancellation policy",
        description:
          "Refund eligibility depends on how close the cancellation is to your check-in date.",
      };
  }
}

export default function BookingDetails({
  checkIn,
  checkOut,
  nights,
  guests,
  guideAvailable,
  cancellationPolicy,
  host,
}: BookingDetailsProps) {
  const formattedCheckIn = format(checkIn, "EEE, dd MMM yyyy");
  const formattedCheckOut = format(checkOut, "EEE, dd MMM yyyy");

  const policy = getPolicyCopy(cancellationPolicy);

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-semibold text-mitti-dark-brown mb-4">
          Your booking
        </h2>

        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-mitti-dark-brown/60">Check in</p>
            <p className="font-medium text-mitti-dark-brown">
              {formattedCheckIn}
            </p>
          </div>

          <div>
            <p className="text-mitti-dark-brown/60">Check out</p>
            <p className="font-medium text-mitti-dark-brown">
              {formattedCheckOut}
            </p>
          </div>

          <div>
            <p className="text-mitti-dark-brown/60">Nights</p>
            <p className="font-medium text-mitti-dark-brown">{nights}</p>
          </div>

          <div>
            <p className="text-mitti-dark-brown/60">Guests</p>
            <p className="font-medium text-mitti-dark-brown">{guests}</p>
          </div>

          <div>
            <p className="text-mitti-dark-brown/60">Local guide</p>
            <p className="font-medium text-mitti-dark-brown">
              {guideAvailable ? "Included" : "Not included"}
            </p>
          </div>

          <div>
            <p className="text-mitti-dark-brown/60">Host contact</p>
            <p className="font-medium text-mitti-dark-brown">
              {host.name}
              {host.phone && (
                <Link href={`tel:${host.phone}`} className="ml-1 underline">
                  • {host.phone}
                </Link>
              )}
              {host.email && (
                <Link href={`mailto:${host.email}`} className="ml-1 underline">
                  • {host.email}
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Cancellation Policy ---------- */}
      <div className="rounded-lg border border-mitti-khaki bg-mitti-cream p-4">
        <p className="text-sm font-medium text-mitti-dark-brown">
          Cancellation policy
        </p>

        <p className="mt-1 text-sm text-mitti-dark-brown/80">
          <span className="font-medium">{policy.title}:</span>{" "}
          {policy.description}
        </p>

        <p className="mt-2 text-xs text-mitti-dark-brown/60">
          Refund amounts are calculated automatically based on this policy and
          how close the cancellation is to your check-in date.
        </p>
      </div>
    </section>
  );
}
