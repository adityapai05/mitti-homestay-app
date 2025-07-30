"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export default function TokenLogger() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("🔥 Firebase Token:", token);
        (window as any).token = token;
      } else {
        console.log("❌ No user signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
