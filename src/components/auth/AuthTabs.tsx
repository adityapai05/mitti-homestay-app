"use client";

import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { FcGoogle } from "react-icons/fc";
import { BsTelephoneFill } from "react-icons/bs";
import { signinWithGoogle } from "@/lib/firebase/authActions";
import PhoneAuthForm from "./PhoneAuthForm";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

const AuthTabs = () => {
  const { type,  openModal, closeModal } = useAuthModal();
  const { user } = useUserStore();
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const activeTab = type;
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!user || hasShownToast) return;

    const { provider, displayName } = user;

    if (provider === "google") {
      toast.success("Login successful");
      closeModal();
      setHasShownToast(true);
    }
    console.log(user)
    if (provider === "phone" && displayName) {
      toast.success("Login successful");
      closeModal();
      setHasShownToast(true);
    }
  }, [user, hasShownToast, closeModal]);

  if (showPhoneForm) {
    console.log("Rendering PhoneAuthForm");
    return <PhoneAuthForm onBack={() => setShowPhoneForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => openModal("login")}
          className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer text-center ${
            activeTab === "login"
              ? "bg-mitti-dark-brown text-mitti-beige"
              : "text-mitti-dark-brown hover:bg-mitti-khaki/30"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => openModal("signup")}
          className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer text-center ${
            activeTab === "signup"
              ? "bg-mitti-dark-brown text-mitti-beige"
              : "text-mitti-dark-brown hover:bg-mitti-khaki/30"
          }`}
        >
          Sign Up
        </button>
      </div>

      <AuthForm type={activeTab} />

      <div className="relative flex items-center justify-center">
        <hr className="w-full border-t border-mitti-khaki/30" />
        <span className="absolute bg-mitti-beige px-3 text-sm text-mitti-dark-brown font-medium">
          or continue with
        </span>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={signinWithGoogle}
          className="flex items-center gap-2 rounded-full border border-mitti-dark-brown bg-white px-4 py-2 shadow-sm hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium text-mitti-dark-brown">
            Google
          </span>
        </button>

        <button
          onClick={() => {
            setShowPhoneForm(true);
            console.log("Phone clicked");
          }}
          className="flex items-center gap-2 rounded-full border border-mitti-dark-brown bg-white px-4 py-2 shadow-sm hover:bg-gray-100 transition cursor-pointer"
        >
          <BsTelephoneFill className="text-mitti-dark-brown text-base" />
          <span className="text-sm font-medium text-mitti-dark-brown">
            Phone
          </span>
        </button>
      </div>
    </div>
  );
};

export default AuthTabs;
