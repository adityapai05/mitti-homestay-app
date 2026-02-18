"use client";

import { useState } from "react";
import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import UserDropdown from "@/components/ui/prebuilt-components/UserDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/firebase/authActions";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PlusSquare,
  Settings,
  Compass,
  LogOut,
} from "lucide-react";

const HostNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.refresh();
      router.replace("/");
    } catch {
      toast.error("Failed to logout");
    }
  }

  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const itemClass =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-mitti-cream border-b border-mitti-khaki shadow-sm text-mitti-dark-brown">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          <SmartLink
            href="/explore"
            className="flex items-center gap-2 text-sm font-medium hover:text-mitti-brown transition-colors"
          >
            <Compass size={16} />
            Guest view
          </SmartLink>

          <UserDropdown />
        </div>

        {/* Mobile hamburger */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen((p) => !p)}
            aria-label="Toggle menu"
            className="relative w-8 h-8 flex items-center justify-center"
          >
            <span
              className={`absolute h-[2px] w-6 bg-mitti-dark-brown transition-transform duration-300 ${
                isOpen ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-mitti-dark-brown transition-transform duration-300 ${
                isOpen ? "-rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden bg-mitti-cream border-t border-mitti-dark-brown/60 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-5 space-y-4">
              {/* Hosting section */}
              <div>
                <p className="px-2 mb-2 text-xs font-semibold tracking-wide text-mitti-dark-brown/60 uppercase">
                  Hosting
                </p>

                <div className="space-y-1">
                  <SmartLink
                    href="/host/homestays"
                    onClick={closeMenu}
                    className={`${itemClass} ${
                      isActive("/host/homestays")
                        ? "bg-mitti-brown/10 text-mitti-brown font-semibold"
                        : "hover:bg-mitti-brown/5"
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </SmartLink>

                  <SmartLink
                    href="/host/homestays/create"
                    onClick={closeMenu}
                    className={`${itemClass} hover:bg-mitti-brown/5`}
                  >
                    <PlusSquare size={18} />
                    Create a new homestay
                  </SmartLink>
                </div>
              </div>

              {/* Account section */}
              <div>
                <p className="px-2 mb-2 text-xs font-semibold tracking-wide text-mitti-dark-brown/60 uppercase">
                  Account
                </p>

                <div className="space-y-1">
                  <SmartLink
                    href="/settings"
                    onClick={closeMenu}
                    className={`${itemClass} hover:bg-mitti-brown/5`}
                  >
                    <Settings size={18} />
                    Profile & settings
                  </SmartLink>
                </div>
              </div>

              {/* Mode switch */}
              <div className="border-t border-mitti-khaki pt-3">
                <SmartLink
                  href="/explore"
                  onClick={closeMenu}
                  className={`${itemClass} hover:bg-mitti-brown/5`}
                >
                  <Compass size={18} />
                  Switch to guest view
                </SmartLink>
              </div>

              {/* Logout */}
              <div className="border-t border-mitti-khaki pt-3">
                <button
                  onClick={async () => {
                    closeMenu();
                    await handleLogout();
                  }}
                  className={`${itemClass} text-red-600 hover:bg-red-100 w-full text-left cursor-pointer`}
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default HostNavbar;
