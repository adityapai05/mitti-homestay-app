"use client";

import LightRays from "@/components/ui/prebuilt-components/LightRays";
import Image from "next/image";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 will-change-transform animate-heroFloat">
        <Image
          src="/hero-bg.png"
          alt="Hero Background Image"
          fill
          priority
          className="object-cover object-top sm:object-center scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />

      <div className="hidden sm:block absolute inset-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff4dc"
          raysSpeed={0.35}
          lightSpread={0.4}
          rayLength={3}
          fadeDistance={1.4}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0}
          distortion={0}
          className="opacity-60 mix-blend-screen"
        />
      </div>
    </div>
  );
};

export default HeroBackground;
