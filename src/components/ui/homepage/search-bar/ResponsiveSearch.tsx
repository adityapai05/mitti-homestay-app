"use client";

import { Suspense, useState } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

const ResponsiveSearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Mobile View */}
      <div className="sm:hidden px-4">
        <button
          onClick={openModal}
          className="w-full bg-white text-mitti-dark-brown rounded-full py-3 px-4 shadow flex items-center justify-between"
        >
          <span className="text-lg font-medium">Start your search</span>
          <Search size={22} />
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchBar />
        </Suspense>
      </div>

      {isModalOpen && <SearchModal onClose={closeModal} />}
    </>
  );
};

export default ResponsiveSearch;
