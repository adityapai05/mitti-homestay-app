import { create } from "zustand";

export type UserRole = "USER" | "HOST" | "ADMIN";

type User = {
  id: string; // prisma user id
  firebaseUid: string;

  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;

  role: UserRole;
  provider: "password" | "google" | "phone";
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
