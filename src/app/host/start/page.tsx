"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Home,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUserStore } from "@/stores/useUserStore";

export default function BecomeHostStartPage() {
  const router = useRouter();
  const { openModal } = useAuthModal();
  const user = useUserStore((state) => state.user);

  const handleGetStarted = () => {
    if (!user) {
      openModal("login");
      return;
    }
    router.push("/host/homestays/create");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-52">
        {/* BACK BUTTON */}
        <motion.button
          onClick={handleGoBack}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-mitti-dark-brown hover:text-mitti-brown transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          Go back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-mitti-dark-brown max-w-xl">
              It’s easy to get started on MITTI
            </h1>

            <p className="mt-4 text-mitti-dark-brown max-w-md">
              Create your rural homestay in under 15 minutes. We guide you
              clearly at every step so nothing feels overwhelming.
            </p>

            <div className="mt-10 space-y-7">
              <StepItem
                icon={<Home size={18} />}
                number={1}
                title="Tell us about your place"
                description="Location, stay type, and guest capacity."
              />

              <StepItem
                icon={<ImageIcon size={18} />}
                number={2}
                title="Make it stand out"
                description="Photos and details that show its character."
              />

              <StepItem
                icon={<CheckCircle size={18} />}
                number={3}
                title="Review and publish"
                description="Set pricing and go live after verification."
              />
            </div>
          </motion.div>

          {/* RIGHT CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="w-full flex justify-center items-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-mitti-cream border border-mitti-khaki rounded-3xl p-8 shadow-md">
              <h2 className="text-xl font-semibold text-mitti-dark-brown">
                Ready to become a host?
              </h2>

              <p className="mt-3 text-sm text-mitti-dark-brown">
                Most hosts complete their listing in about 10 to 15 minutes.
              </p>

              <button
                onClick={handleGetStarted}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-mitti-brown text-white font-medium transition-all hover:bg-mitti-brown/90 cursor-pointer hover:shadow-lg active:scale-[0.98]"
              >
                Get started
                <ArrowRight size={18} />
              </button>

              <p className="mt-4 text-xs text-mitti-dark-brown text-center">
                You can edit your listing anytime after publishing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP ITEM ---------- */

function StepItem({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 6 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-4"
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mitti-khaki text-mitti-dark-brown">
          {icon}
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mitti-brown text-white text-xs flex items-center justify-center font-medium">
          {number}
        </div>
      </div>

      <div className="max-w-md">
        <h3 className="font-medium text-mitti-dark-brown">{title}</h3>
        <p className="text-sm text-mitti-dark-brown">{description}</p>
      </div>
    </motion.div>
  );
}
