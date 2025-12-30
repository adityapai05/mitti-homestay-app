import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function HostBookingsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white border border-mitti-khaki rounded-2xl p-12">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mitti-cream">
        <BookOpen className="h-7 w-7 text-mitti-brown" />
      </div>

      <h2 className="text-xl font-semibold text-mitti-dark-brown">
        No bookings yet
      </h2>

      <p className="mt-2 text-sm text-mitti-dark-brown/70 max-w-md">
        When guests book your homestays, their stays and requests will appear
        here.
      </p>

      <Link
        href="/host/homestays"
        className="mt-6 inline-flex items-center rounded-lg bg-mitti-brown px-6 py-3 text-sm font-medium text-white hover:bg-mitti-brown/90 cursor-pointer"
      >
        View your homestays
      </Link>
    </div>
  );
}
