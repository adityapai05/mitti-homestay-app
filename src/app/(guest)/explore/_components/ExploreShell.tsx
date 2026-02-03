"use client";

import { motion } from "framer-motion";
import React from "react";

interface ExploreShellProps {
  children: React.ReactNode;
}

export default function ExploreShell({ children }: ExploreShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="flex flex-col gap-6"
    >
      {children}
    </motion.section>
  );
}
