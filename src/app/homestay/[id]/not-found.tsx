"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

const HomestayNotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-mitti-cream to-mitti-beige text-mitti-dark-brown px-4 sm:px-6 py-12">
      <div className="text-center mx-auto relative p-8 rounded-2xl max-w-md">
        <Home size={60} className="mx-auto mb-6 text-mitti-olive" />
        <h1 className="text-5xl font-bold mb-4">Homestay Not Found</h1>
        <p className="text-md md:text-2xl font-semibold mb-2">
          This homestay is off the map!
        </p>
        <p className="text-sm md:text-md mb-6 text-balance text-mitti-muted">
          It seems this retreat has wandered into the wilderness. Explore other
          unique homestays to find your perfect getaway.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-medium bg-mitti-olive text-white px-4 py-2 rounded-full hover:bg-mitti-brown transition cursor-pointer"
        >
          <ArrowLeft size={18} /> Discover Homestays
        </Link>
      </div>
    </div>
  );
};

export default HomestayNotFoundPage;
