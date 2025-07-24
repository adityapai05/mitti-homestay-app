import { create } from "zustand";

type AuthModalState = {
  isOpen: boolean;
  type: "login" | "signup";
  openModal: (type: "login" | "signup") => void;
  closeModal: () => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  type: "login",
  openModal: (type) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false }),
}));
