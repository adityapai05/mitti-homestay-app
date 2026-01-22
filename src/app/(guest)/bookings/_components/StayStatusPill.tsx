import { Stay } from "./types";

export default function StayStatusPill({ stay }: { stay: Stay }) {
  let label: string;
  let color: string;

  switch (stay.status) {
    case "PENDING_HOST_APPROVAL":
      label = "Waiting for host approval";
      color = "bg-mitti-error/10 text-mitti-error";
      break;

    case "AWAITING_PAYMENT":
      label = "Payment pending";
      color = "bg-mitti-error/10 text-mitti-error";
      break;

    case "CONFIRMED":
      if (stay.bookingStatus.isActive) {
        label = "Ongoing";
        color = "bg-mitti-olive/10 text-mitti-olive";
      } else if (stay.bookingStatus.isPast) {
        label = "Completed";
        color = "bg-mitti-muted/10 text-mitti-muted";
      } else {
        label = "Confirmed";
        color = "bg-mitti-olive/10 text-mitti-olive";
      }
      break;

    case "COMPLETED":
      label = "Completed";
      color = "bg-mitti-muted/10 text-mitti-muted";
      break;

    case "CANCELLED_BY_GUEST":
      label = "Cancelled by you";
      color = "bg-mitti-error/10 text-mitti-error";
      break;

    case "CANCELLED_BY_HOST":
      label = "Cancelled by host";
      color = "bg-mitti-error/10 text-mitti-error";
      break;

    default:
      label = "Unknown";
      color = "bg-gray-200 text-gray-700";
  }

  return (
    <div
      className={`self-start rounded-full px-3 py-1 text-xs font-medium ${color}`}
    >
      {label}
    </div>
  );
}
