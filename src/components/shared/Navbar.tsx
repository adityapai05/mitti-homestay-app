"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useUserStore } from "@/stores/useUserStore";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase/client";
import { sendEmailVerification } from "firebase/auth";

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
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isVerificationBannerDismissed, setIsVerificationBannerDismissed] =
    useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setIsEmailVerified(firebaseUser?.emailVerified ?? true);
      setIsVerificationBannerDismissed(false);
    });

    return () => unsubscribe();
  }, []);

  const hostLink: NavLink =
    user?.role === "HOST"
      ? { href: "/host/homestays", label: "Host Dashboard" }
      : { href: "/host/start", label: "Become a Host" };

  const navLinks: NavLink[] = [...baseNavLinks, hostLink];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const shouldShowVerificationBanner =
    !!user && !isEmailVerified && !isVerificationBannerDismissed;

  useEffect(() => {
    if (!shouldShowVerificationBanner) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;

      await user.reload();
      if (user.emailVerified) {
        setIsEmailVerified(true);
        router.refresh();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [shouldShowVerificationBanner, router]);

  return (
    <nav className="w-full sticky top-0 z-50 bg-mitti-cream text-mitti-dark-brown shadow-sm">
      {shouldShowVerificationBanner && (
        <div className="border-b border-amber-300 bg-amber-100/80">
          <div className="mx-auto flex max-w-full items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-amber-900 leading-snug">
              Verify your email to enable booking. We sent a verification link
              to your inbox.
              <br className="hidden sm:block" />
              Check your Inbox and Spam/Junk folder. After verifying, come back
              and reload this page.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isResendingVerification}
                onClick={async () => {
                  const currentUser = auth.currentUser;
                  if (!currentUser) {
                    toast.error("Please sign in again to continue.");
                    return;
                  }

                  setIsResendingVerification(true);
                  try {
                    await sendEmailVerification(currentUser);
                    toast.success(
                      "Email sent again. Please wait a minute and check Spam/Junk if you don’t see it.",
                    );
                  } catch {
                    toast.error("Unable to resend verification email.");
                  } finally {
                    setIsResendingVerification(false);
                  }
                }}
                className="rounded-md border border-amber-800 px-3 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResendingVerification ? "Sending..." : "Resend email"}
              </button>
              <button
                type="button"
                onClick={() => setIsVerificationBannerDismissed(true)}
                className="rounded-md px-2 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <SmartLink
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
          </SmartLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <SmartLink
                key={link.href}
                href={link.href}
                className="relative group"
              >
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
              </SmartLink>
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
                      <SmartLink
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
                      </SmartLink>
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
                    <SmartLink
                      href="/bookings"
                      onClick={closeMenu}
                      className={`block rounded-md px-3 py-2 font-medium ${
                        pathname.startsWith("/bookings")
                          ? "bg-mitti-brown/10 text-mitti-brown font-semibold"
                          : "hover:bg-mitti-brown/5 hover:text-mitti-brown"
                      }`}
                    >
                      My Bookings
                    </SmartLink>
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
                      try {
                        await logout();
                        toast.success("Logged out successfully");
                        router.refresh();
                      } catch {
                        toast.error("Failed to logout");
                      }
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
