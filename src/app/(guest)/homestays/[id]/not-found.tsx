import Link from "next/link";
import { MapPinOff, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mitti-beige px-4 py-16 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-mitti-khaki bg-white p-8 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-mitti-olive/10">
            <MapPinOff className="h-7 w-7 text-mitti-olive" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-mitti-dark-brown">
          Homestay not found
        </h1>

        <p className="mt-2 text-sm text-mitti-dark-brown/70">
          This homestay may have been removed, is no longer available, or the
          link is incorrect.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-mitti-brown px-5 py-3 text-white font-medium hover:bg-mitti-brown/90 transition"
          >
            <ArrowLeft size={18} />
            Back to explore
          </Link>

          <Link
            href="/"
            className="text-sm text-mitti-dark-brown/70 hover:text-mitti-dark-brown transition"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
