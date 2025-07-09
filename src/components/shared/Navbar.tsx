"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/list-your-home", label: "List Your Home" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About Us" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

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

          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={` ${
                  pathname === link.href ? "font-bold" : "font-medium"
                } hover:underline transition duration-150 `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="bg-mitti-brown text-mitti-beige hidden md:flex font-medium px-4 py-2 rounded hover:bg-opacity-90 transition"
            >
              Log In / Sign Up
            </Link>
          </div>

          {/* Mobile Responsive Navbar */}
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
      {isOpen && (
        <div className="md:hidden  bg-mitti-cream text-left border-t p-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`block ${
                pathname === link.href ? "font-bold" : "font-medium"
              } transition duration-150`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t mt-4">
            <Link
              href="/auth"
              onClick={closeMenu}
              className="block w-full text-center bg-mitti-brown text-mitti-beige font-medium px-4 py-2 rounded"
            >
              Login/Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
