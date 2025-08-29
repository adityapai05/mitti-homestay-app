"use client";

import { auth } from "@/lib/firebase/client";
import { useUserStore } from "@/stores/useUserStore";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { useEffect } from "react";

const useFirebaseAuth = () => {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await getIdToken(firebaseUser, true);
          const providerId = firebaseUser.providerData[0]?.providerId;

          const res = await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to sync user with backend");
          }

          const { user } = await res.json();

          setUser({
            uid: user.firebaseUid,
            email: user.email,
            phoneNumber: user.phone,
            displayName: user.name,
            photoURL: user.image,
            provider:
              providerId === "google.com"
                ? "google"
                : providerId === "phone"
                ? "phone"
                : "password",
          });
        } catch (err) {
          console.error("[AUTH_SYNC_ERROR]", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
};

export default useFirebaseAuth;
