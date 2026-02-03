"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import FadeContent from "@/components/ui/prebuilt-components/FadeContent";

const SearchModal = dynamic(() => import("@/components/shared/search/SearchModal"), {
  ssr: false,
});

const SearchTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="pre-hydration-hidden">
        <FadeContent duration={600} initialOpacity={0}>
          <button
            onClick={() => setOpen(true)}
            className="group w-full max-w-md bg-white border border-black/5 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[102%]"
          >
            <div className="p-2.5 rounded-xl bg-mitti-khaki text-mitti-dark-brown border border-mitti-dark-brown/80">
              <Search size={20} />
            </div>

            <div className="text-left">
              <p className="font-semibold text-mitti-dark-brown text-sm sm:text-base">
                Where do you want to go?
              </p>
              <p className="text-xs sm:text-sm text-mitti-dark-brown/80">
                Search villages, regions, or explore anywhere
              </p>
            </div>
          </button>
        </FadeContent>
      </div>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default SearchTrigger;
