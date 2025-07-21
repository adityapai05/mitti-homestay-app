"use client";

import Image from "next/image";
import ResponsiveSearch from "./search-bar/ResponsiveSearch";
import GradientText from "@/components/ui/prebuilt-components/GradientText";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      <Image
        src="/hero-bg.png"
        alt="Sunrise over huts and palm trees"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="absolute top-16 left-0 right-0 z-10 flex justify-center px-4">
        <div className="w-full max-w-6xl">
          <ResponsiveSearch />
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center px-4 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">
          Stay in the {" "}
          <GradientText
            colors={["#FF9933", "#ffffff", "#138808"]}
            animationSpeed={3}
          >
            Heart of Bharat.
          </GradientText>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-mitti-beige max-w-3xl drop-shadow-md">
          Discover authentic local stays hosted by locals across India.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
