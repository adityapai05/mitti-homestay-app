"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useUserStore } from "@/stores/useUserStore";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/prebuilt-components/avatar";
import { Separator } from "@/components/ui/prebuilt-components/separator";
import { Button } from "@/components/ui/prebuilt-components/button";
import UserDropdown from "../ui/prebuilt-components/UserDropdown";
import { toast } from "sonner";
import { logout } from "@/lib/firebase/authActions";

const baseNavLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About Us" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const { openModal } = useAuthModal();
  const user = useUserStore((state) => state.user);

  const hostLink =
    user?.role === "HOST"
      ? { href: "/host/homestays", label: "Host Dashboard" }
      : { href: "/host/start", label: "List Your Home" };

  const navLinks = [...baseNavLinks, hostLink];

  return (
    <nav className="w-full sticky top-0 z-50 bg-mitti-cream text-mitti-dark-brown shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mitti-logo.png"
              alt="Mitti Logo"
              width={75}
              height={30}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href ? "font-bold" : "font-medium"
                } hover:underline transition duration-150`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <UserDropdown />
            ) : (
              <Button
                onClick={() => openModal("login")}
                className="bg-mitti-brown text-mitti-beige font-medium"
              >
                <LogIn />
                Login / Signup
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-mitti-cream border-t border-mitti-dark-brown/70 px-4 py-6 space-y-4">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block ${
                  pathname === link.href ? "font-bold" : "font-medium"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/bookings"
                onClick={closeMenu}
                className={`block ${
                  pathname === "/bookings" ? "font-bold" : "font-medium"
                }`}
              >
                My Bookings
              </Link>
            )}
          </div>

          <Separator className="bg-mitti-dark-brown/70" />

          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image || "/default-avatar.png"} />
                </Avatar>
                <p className="text-sm font-medium">
                  {user.email || user.phone}
                </p>
              </div>

              <Button
                variant="ghost"
                className="text-red-600"
                onClick={async () => {
                  await logout();
                  toast.success("Logged out successfully");
                }}
              >
                <LogOut />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-mitti-brown text-mitti-beige"
              onClick={() => openModal("login")}
            >
              <LogIn />
              Login / Signup
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
