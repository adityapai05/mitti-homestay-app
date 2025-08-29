"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/auth/AuthModal";

export default function GlobalModals() {
  const { isOpen } = useAuthModal();

  return isOpen ? <AuthModal /> : null;
}
