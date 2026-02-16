"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthTabs from "./AuthTabs";

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const AuthModal = () => {
  const { isOpen, closeModal } = useAuthModal();
  const [isBusy, setIsBusy] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Smooth mount animation
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = modalRef.current;

    const focusable = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      // ESC close
      if (event.key === "Escape") {
        if (!isBusy) closeModal();
        return;
      }

      // TAB trap
      if (event.key !== "Tab") return;

      const focusableNodes =
        node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (focusableNodes.length === 0) return;

      const first = focusableNodes[0];
      const last = focusableNodes[focusableNodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isOpen, isBusy, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible
          ? "bg-mitti-dark-brown/45 opacity-100"
          : "bg-mitti-dark-brown/0 opacity-0"
      }`}
      onMouseDown={() => {
        if (!isBusy) closeModal();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl bg-mitti-beige p-7 shadow-[0_20px_50px_rgba(0,0,0,0.18)] md:max-w-[500px] transition-all duration-200 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeModal}
          disabled={isBusy}
          aria-label="Close authentication modal"
          className="absolute right-4 top-4 rounded-full bg-mitti-dark-brown p-1 text-mitti-beige transition-all duration-150 hover:bg-mitti-brown hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <div className="transition-transform duration-200 hover:scale-105">
            <Image
              src="/mitti-logo-stacked.png"
              alt="MITTI Logo"
              width={70}
              height={35}
              priority
            />
          </div>
        </div>

        {/* Form */}
        <AuthTabs setModalBusy={setIsBusy} />
      </div>
    </div>
  );
};

export default AuthModal;
