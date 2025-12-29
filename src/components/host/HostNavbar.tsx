"use client";

import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/ui/prebuilt-components/UserDropdown";

const HostNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-mitti-cream border-b border-mitti-khaki shadow-sm text-mitti-dark-brown">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/host/homestays" className="flex items-center gap-2">
          <Image
            src="/mitti-logo.png"
            alt="MITTI"
            width={75}
            height={30}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:inline text-sm font-medium text-mitti-dark-brown hover:underline"
          >
            Switch to travelling
          </Link>

          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};

export default HostNavbar;
