import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function BookingNotFound() {
  return (
    <main className="bg-mitti-beige min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-mitti-khaki bg-white p-6 text-center shadow-sm">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mitti-cream">
          <MapPinOff className="h-8 w-8 text-mitti-dark-brown/70" />
        </div>

        <h1 className="text-lg font-semibold text-mitti-dark-brown">
          Booking not found
        </h1>

        <p className="mt-2 text-sm text-mitti-dark-brown/70">
          This booking does not exist, has been cancelled, or you do not have
          access to view it.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/bookings"
            className="block w-full rounded-lg bg-mitti-brown px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            View my bookings
          </Link>

          <Link
            href="/explore"
            className="block w-full rounded-lg bg-mitti-khaki px-4 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-beige"
          >
            Explore homestays
          </Link>
        </div>
      </div>
    </main>
  );
}
