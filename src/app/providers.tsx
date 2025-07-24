"use client";

import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  useFirebaseAuth();
  return children;
}
