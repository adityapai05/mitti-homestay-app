"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const SearchModal = dynamic(
  () => import("@/components/shared/search/SearchModal"),
  { ssr: false },
);

const SearchTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="pre-hydration-hidden"
      >
        <button
          onClick={() => setOpen(true)}
          className="group w-full max-w-md bg-white border border-black/5 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
        >
          <motion.div
            whileHover={{ rotate: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="p-2.5 rounded-xl bg-mitti-khaki text-mitti-dark-brown border border-mitti-dark-brown/80"
          >
            <Search size={20} />
          </motion.div>

          <div className="text-left">
            <p className="font-semibold text-mitti-dark-brown text-sm sm:text-base">
              Where do you want to go?
            </p>
            <p className="text-xs sm:text-sm text-mitti-dark-brown/70 transition-opacity group-hover:text-mitti-dark-brown/90">
              Search villages, regions, or explore anywhere
            </p>
          </div>
        </button>
      </motion.div>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default SearchTrigger;
