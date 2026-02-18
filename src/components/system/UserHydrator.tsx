"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";

type Props = {
  user: any;
};

export default function UserHydrator({ user }: Props) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
