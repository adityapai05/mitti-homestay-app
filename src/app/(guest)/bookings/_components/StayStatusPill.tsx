import { Stay } from "./types";

export default function StayStatusPill({ stay }: { stay: Stay }) {
  let label = "Confirmed";
  let color = "bg-mitti-olive/10 text-mitti-olive";

  if (stay.bookingStatus.isActive) label = "Ongoing";
  if (stay.bookingStatus.isPast) label = "Completed";
  if (stay.status === "CANCELLED") {
    label = "Cancelled";
    color = "bg-mitti-error/10 text-mitti-error";
  }

  return (
    <div
      className={`self-start rounded-full px-3 py-1 text-xs font-medium ${color}`}
    >
      {label}
    </div>
  );
}
