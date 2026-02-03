import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Explore Homestays | Mitti",
  description: "Browse authentic rural homestays across India.",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-mitti-beige text-mitti-dark-brown">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
