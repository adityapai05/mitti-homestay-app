import Link from "next/link";
import { CalendarX } from "lucide-react";
import { CancellationPolicy } from "@prisma/client";

function getCancellationCopy(policy: CancellationPolicy) {
  switch (policy) {
    case "FLEXIBLE":
      return {
        title: "Flexible Cancellation Policy",
        description: "Cancel 7 days or more before check-in for a full refund.",
      };

    case "MODERATE":
      return {
        title: "Moderate Cancellation Policy",
        description:
          "Cancel 14 days before check-in for a full refund. Partial refund available up to 7 days before check-in.",
      };

    case "STRICT":
      return {
        title: "Strict Cancellation Policy",
        description:
          "Cancel 30 days before check-in for a partial refund. No refund for late cancellations.",
      };

    default:
      return {
        title: "Cancellation policy",
        description:
          "Refund eligibility depends on how close the cancellation is to check-in.",
      };
  }
}

export default function CancellationInfo({
  policies,
}: {
  policies: { cancellationPolicy: CancellationPolicy };
}) {
  const copy = getCancellationCopy(policies.cancellationPolicy);

  return (
    <div className="space-y-2 text-sm text-mitti-dark-brown/80 bg-white p-5 rounded-xl border border-mitti-khaki">
      <CalendarX className="h-5 w-5 text-mitti-olive" />

      <h3 className="font-medium text-mitti-dark-brown">{copy.title}</h3>

      <p>{copy.description}</p>

      <Link
        href="/cancellation-policy"
        className="text-sm text-mitti-olive underline underline-offset-2"
      >
        Learn more
      </Link>
    </div>
  );
}
