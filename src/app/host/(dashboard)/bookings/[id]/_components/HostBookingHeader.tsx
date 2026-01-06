import type { BookingStatus } from "@prisma/client";

export default function HostBookingHeader({
  status,
}: {
  status: BookingStatus;
}) {
  const labelMap: Record<BookingStatus, string> = {
    PENDING_HOST_APPROVAL: "Awaiting your approval",
    AWAITING_PAYMENT: "Awaiting guest payment",
    CONFIRMED: "Booking confirmed",
    CANCELLED_BY_GUEST: "Cancelled by guest",
    CANCELLED_BY_HOST: "You cancelled this booking",
    COMPLETED: "Stay completed",
  };

  return (
    <div className="rounded-xl border border-mitti-khaki bg-white p-5">
      <p className="text-sm text-mitti-dark-brown/60">Booking status</p>
      <h1 className="mt-1 text-xl font-semibold text-mitti-dark-brown">
        {labelMap[status]}
      </h1>
    </div>
  );
}
