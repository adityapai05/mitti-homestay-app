"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useUserStore } from "@/stores/useUserStore";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // lock background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.04]"
          >
            <Image
              src="/mitti-logo-icon.png"
              alt="MITTI logo"
              width={40}
              height={20}
              className="object-contain md:ml-5"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group">
                <span
                  className={`block transition-all duration-200 ${
                    isActive(link.href)
                      ? "font-semibold text-mitti-brown"
                      : "font-medium group-hover:text-mitti-brown group-hover:-translate-y-[1px]"
                  }`}
                >
                  {link.label}
                </span>

                {/* desktop underline only */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-mitti-brown origin-left transition-transform duration-300 ${
                    isActive(link.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <UserDropdown />
              </motion.div>
            ) : (
              <Button
                onClick={() => openModal("login")}
                className="bg-mitti-brown text-mitti-beige font-medium hover:bg-mitti-brown/80 active:scale-[0.97] transition-transform cursor-pointer"
              >
                <LogIn className="mr-2 size-4" />
                Login or Signup
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <span
                className={`absolute h-[2px] w-6 bg-mitti-dark-brown transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute h-[2px] w-6 bg-mitti-dark-brown transition-transform duration-300 ease-out ${
                  isOpen ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu – furl down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-mitti-cream border-t border-mitti-dark-brown/60 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.25,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={`relative block rounded-md px-3 py-2 transition-colors ${
                          active
                            ? "bg-mitti-brown/10 text-mitti-brown font-semibold"
                            : "font-medium hover:bg-mitti-brown/5 hover:text-mitti-brown"
                        }`}
                      >
                        {/* left accent bar */}
                        {active && (
                          <motion.span
                            layoutId="mobile-active-indicator"
                            className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-mitti-brown"
                          />
                        )}

                        <span className="pl-2">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: navLinks.length * 0.05,
                      duration: 0.25,
                    }}
                  >
                    <Link
                      href="/bookings"
                      onClick={closeMenu}
                      className={`block rounded-md px-3 py-2 font-medium ${
                        pathname.startsWith("/bookings")
                          ? "bg-mitti-brown/10 text-mitti-brown font-semibold"
                          : "hover:bg-mitti-brown/5 hover:text-mitti-brown"
                      }`}
                    >
                      My Bookings
                    </Link>
                  </motion.div>
                )}
              </div>

              <Separator className="bg-mitti-dark-brown/60" />

              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-between"
                >
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
                    className="text-mitti-error active:scale-[0.97]"
                    onClick={async () => {
                      await logout();
                      toast.success("Logged out successfully");
                      closeMenu();
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Button
                    className="w-full bg-mitti-brown text-mitti-beige active:scale-[0.97]"
                    onClick={() => {
                      openModal("login");
                      closeMenu();
                    }}
                  >
                    <LogIn className="mr-2 size-4" />
                    Login or Signup
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
