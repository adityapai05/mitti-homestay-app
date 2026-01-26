"use client";

import HeroBackground from "./HeroBackground";
import HeroCopy from "./HeroCopy";
import SearchTrigger from "./SearchTrigger";

const HeroSection = () => {
  return (
    <section className="relative min-h-[78svh] sm:min-h-screen w-full overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-26 sm:pt-40 pb-12 sm:pb-20 flex flex-col gap-6 sm:gap-8">
        <HeroCopy />
        <SearchTrigger />
      </div>
    </section>
  );
};

export default HeroSection;
