"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthTabs from "./AuthTabs";

const AuthModal = () => {
  const { isOpen, closeModal } = useAuthModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mitti-dark-brown/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-mitti-beige p-6 shadow-xl md:w-[480px]">
        <div id="recaptcha-container" />
        <button
          className="absolute right-4 top-4 text-mitti-beige bg-mitti-dark-brown rounded-full p-1 hover:bg-mitti-brown cursor-pointer"
          onClick={closeModal}
        >
          <X className="size-5" />
        </button>

        <div className="flex justify-center">
          <Image
            src="/mitti-logo-stacked.png"
            alt="MITTI Logo"
            width={100}
            height={50}
          />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-mitti-dark-brown">
            Namaste!🙏
          </h2>
          <p className="text-mitti-dark-brown text-sm mt-1">
            Login or create an account to book authentic rural stays.
          </p>
        </div>
        <AuthTabs />
      </div>
    </div>
  );
};

export default AuthModal;
