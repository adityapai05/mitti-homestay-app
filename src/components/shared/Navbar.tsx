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

type NavLink = {
  href: string;
  label: string;
};

const baseNavLinks: NavLink[] = [
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useAuthModal();
  const user = useUserStore((state) => state.user);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const hostLink: NavLink =
    user?.role === "HOST"
      ? { href: "/host/homestays", label: "Host Dashboard" }
      : { href: "/host/start", label: "Become a Host" };

  const navLinks: NavLink[] = [...baseNavLinks, hostLink];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-mitti-cream text-mitti-dark-brown shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mitti-logo.png"
              alt="MITTI logo"
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
                className={`transition-all duration-200 ${
                  isActive(link.href)
                    ? "font-semibold text-mitti-brown"
                    : "font-medium hover:text-mitti-brown hover:-translate-y-[1px]"
                }`}
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
                className="bg-mitti-brown text-mitti-beige font-medium hover:bg-mitti-brown/80"
              >
                <LogIn className="mr-2 size-4" />
                Login or Signup
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-mitti-cream border-t border-mitti-dark-brown/60 px-4 py-6 space-y-4">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block transition-colors ${
                  isActive(link.href)
                    ? "font-semibold text-mitti-brown"
                    : "font-medium hover:text-mitti-brown"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/bookings"
                onClick={closeMenu}
                className={`block transition-colors ${
                  pathname.startsWith("/bookings")
                    ? "font-semibold text-mitti-brown"
                    : "font-medium hover:text-mitti-brown"
                }`}
              >
                My Bookings
              </Link>
            )}
          </div>

          <Separator className="bg-mitti-dark-brown/60" />

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
                className="text-mitti-error"
                onClick={async () => {
                  await logout();
                  toast.success("Logged out successfully");
                }}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-mitti-brown text-mitti-beige"
              onClick={() => openModal("login")}
            >
              <LogIn className="mr-2 size-4" />
              Login or Signup
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
