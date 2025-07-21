"use client";

import Link from "next/link";
import { Ghost, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mitti-beige text-mitti-dark-brown px-4 sm:px-6 py-12">
      <div className="text-center mx-auto">
        <Ghost size={60} className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-md md:text-2xl font-semibold mb-2">
          You’re in the middle of nowhere... literally.
        </p>
        <p className="text-sm md:text-md  mb-6 text-balance">
          This page doesn’t exist - but somewhere, a hidden village is still waiting to be discovered.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium bg-mitti-dark-brown text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition"
        >
          <ArrowLeft size={18} /> Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
