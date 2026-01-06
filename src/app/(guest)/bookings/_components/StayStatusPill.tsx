import { Stay } from "./types";

export default function StayStatusPill({ stay }: { stay: Stay }) {
  let label = "Confirmed";
  let color = "bg-mitti-olive/10 text-mitti-olive";

  if (stay.bookingStatus.isActive) {
    label = "Ongoing";
  }

  if (stay.bookingStatus.isPast) {
    label = "Completed";
  }

  if (stay.status === "CANCELLED_BY_GUEST") {
    label = "Cancelled by you";
    color = "bg-mitti-error/10 text-mitti-error";
  }

  if (stay.status === "CANCELLED_BY_HOST") {
    label = "Cancelled by host";
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
