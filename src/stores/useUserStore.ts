import { create } from "zustand";

export type UserRole = "USER" | "HOST" | "ADMIN";

type User = {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  provider: "password" | "google" | "phone";
  role: UserRole;
};

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
