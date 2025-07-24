"use client";
import { auth } from "@/lib/firebase/client";
import { useUserStore } from "@/stores/useUserStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const useFirebaseAuth = () => {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const providerId = firebaseUser.providerData[0]?.providerId;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider:
            providerId === "google.com"
              ? "google"
              : providerId === "phone"
              ? "phone"
              : "password",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);
};

export default useFirebaseAuth;
