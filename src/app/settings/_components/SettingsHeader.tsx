"use client";

import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/prebuilt-components/sidebar";

export default function SettingsHeader() {
  return (
    <header className="sticky top-0 z-30 bg-mitti-cream border-b border-mitti-khaki">
      <div className="flex h-18 items-center justify-between px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <SidebarTrigger className="md:hidden" />

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mitti-logo.png"
              alt="MITTI"
              width={75}
              height={30}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right */}
        <Link
          href="/"
          className="rounded-full bg-mitti-beige px-5 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-khaki transition"
        >
          Done
        </Link>
      </div>
    </header>
  );
}
