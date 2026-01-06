import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { BookingStatus } from "@prisma/client";

interface HostBookingCardProps {
  booking: {
    id: string;
    status: BookingStatus;
    checkIn: Date;
    checkOut: Date;
    guests: number;

    homestay: {
      id: string;
      name: string;
      imageUrl: string[];
      displayAddress: string;
    };

    user: {
      name: string;
      image: string | null;
    };

    hostActions: {
      canApprove: boolean;
      canReject: boolean;
      isUpcoming: boolean;
      isActive: boolean;
      isPast: boolean;
    };
  };
}

export default function HostBookingCard({ booking }: HostBookingCardProps) {
  async function handleAction(action: "approve" | "reject") {
    try {
      const res = await fetch(`/api/host/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const cover = booking.homestay.imageUrl?.[0] ?? "/mitti-placeholder.jpg";

  return (
    <div
      className="flex gap-4 rounded-2xl border border-mitti-khaki bg-white p-4
                 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-mitti-beige">
        <Image
          src={cover}
          alt={booking.homestay.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-mitti-dark-brown">
            {booking.user.name}
          </p>

          <p className="text-xs text-mitti-dark-brown/60 mt-0.5">
            {booking.homestay.name} • {booking.homestay.displayAddress}
          </p>

          <p className="mt-2 text-sm text-mitti-dark-brown">
            {new Date(booking.checkIn).toLocaleDateString()} →{" "}
            {new Date(booking.checkOut).toLocaleDateString()} · {booking.guests}{" "}
            guest{booking.guests > 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-3">
          <StatusPill status={booking.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between items-end gap-2">
        <Link
          href={`/host/bookings/${booking.id}`}
          className="text-sm font-medium text-mitti-olive hover:underline cursor-pointer"
        >
          View details
        </Link>

        {booking.status === "PENDING_HOST_APPROVAL" && (
          <div className="flex gap-2">
            {booking.hostActions.canApprove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="rounded-lg bg-mitti-olive px-4 py-2 text-sm font-medium text-white hover:opacity-90 cursor-pointer">
                    Approve
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The guest will be notified and asked to complete payment
                      for this stay.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAction("approve")}
                      className="bg-mitti-olive text-white hover:opacity-90 cursor-pointer"
                    >
                      Approve booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {booking.hostActions.canReject && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="rounded-lg bg-mitti-khaki px-4 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-khaki/80 cursor-pointer">
                    Reject
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This booking request will be cancelled and the guest will
                      be informed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Keep booking
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAction("reject")}
                      className="bg-red-600 text-white hover:bg-red-600/90 cursor-pointer"
                    >
                      Reject booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    PENDING_HOST_APPROVAL: "bg-mitti-khaki text-mitti-dark-brown",
    AWAITING_PAYMENT: "bg-mitti-cream text-mitti-dark-brown",
    CONFIRMED: "bg-mitti-olive text-white",
    COMPLETED: "bg-mitti-brown text-white",
    CANCELLED_BY_GUEST: "bg-red-100 text-red-700",
    CANCELLED_BY_HOST: "bg-red-200 text-red-800",
  };

  const labelMap: Record<BookingStatus, string> = {
    PENDING_HOST_APPROVAL: "Pending approval",
    AWAITING_PAYMENT: "Awaiting payment",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED_BY_GUEST: "Cancelled by guest",
    CANCELLED_BY_HOST: "Cancelled by you",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        map[status]
      }`}
    >
      {labelMap[status]}
    </span>
  );
}
