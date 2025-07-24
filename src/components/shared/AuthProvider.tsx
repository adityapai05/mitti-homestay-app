"use client";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";

const AuthProvider = () => {
  useFirebaseAuth();
  return null;
};

export default AuthProvider;
