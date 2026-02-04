import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mitti-cream to-mitti-beige px-6">
      <div className="text-center max-w-md">
        <Home className="mx-auto mb-6 text-mitti-olive" size={64} />

        <h1 className="text-4xl font-bold text-mitti-dark-brown mb-3">
          Homestay not found
        </h1>

        <p className="text-mitti-muted mb-8">
          This homestay may have been removed or is no longer available.
          Discover other authentic stays instead.
        </p>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full bg-mitti-brown px-5 py-2 text-white hover:bg-mitti-dark-brown transition"
        >
          <ArrowLeft size={18} />
          Back to explore
        </Link>
      </div>
    </div>
  );
}
