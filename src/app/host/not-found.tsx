"use client";

import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function HostNotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mitti-beige text-mitti-dark-brown px-4 sm:px-6 py-12">
      <div className="max-w-md text-center">
        <Home size={56} className="mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-3">You are not a host yet</h1>

        <p className="text-sm md:text-base mb-6 text-mitti-dark-brown/80 text-balance">
          This section is only available to hosts. To access host tools, you
          need to create your first homestay.
        </p>

        <Link
          href="/host/start"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-mitti-dark-brown hover:bg-mitti-dark-brown/90 text-white px-5 py-3 rounded-full hover:bg-opacity-90 transition"
        >
          Become a host
          <ArrowRight size={18} />
        </Link>

        <div className="mt-4">
          <Link
            href="/"
            className="text-xs text-mitti-dark-brown/60 hover:text-mitti-dark-brown underline"
          >
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
