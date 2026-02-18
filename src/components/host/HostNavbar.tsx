"use client";

import Image from "next/image";
import UserDropdown from "@/components/ui/prebuilt-components/UserDropdown";
import SmartLink from "@/components/shared/SmartLink";

const HostNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-mitti-cream border-b border-mitti-khaki shadow-sm text-mitti-dark-brown">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <SmartLink href="/host/homestays" className="flex items-center gap-2">
            <Image
              src="/mitti-logo-icon.png"
              alt="MITTI logo"
              width={40}
              height={20}
              className="object-contain md:ml-5"
              priority
            />
        </SmartLink>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <SmartLink
            href="/"
            className="hidden sm:inline text-sm font-medium text-mitti-dark-brown hover:underline"
          >
            Switch to travelling
          </SmartLink>

          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};

export default HostNavbar;
