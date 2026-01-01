import Link from "next/link";
import { CalendarX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center bg-white border border-mitti-khaki rounded-2xl p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mitti-cream">
          <CalendarX className="h-6 w-6 text-mitti-brown" />
        </div>

        <h2 className="text-xl font-semibold text-mitti-dark-brown">
          Booking not found
        </h2>

        <p className="mt-2 text-sm text-mitti-dark-brown/70">
          This booking may have been removed or you may not have access to it.
        </p>

        <Link
          href="/host/bookings"
          className="mt-6 inline-block rounded-lg bg-mitti-brown px-6 py-3 text-sm font-medium text-white hover:bg-mitti-brown/90 cursor-pointer"
        >
          Back to bookings
        </Link>
      </div>
    </div>
  );
}
