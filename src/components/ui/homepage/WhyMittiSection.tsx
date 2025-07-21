"use client";

import React from "react";
import MagicBento from "@/components/ui/prebuilt-components/MagicBento";

const WhyMittiSection: React.FC = () => {
  return (
    <section id="why-mitti" className="bg-mitti-beige text-center pt-12 px-4">
      <h2 className="text-3xl sm:text-6xl font-bold text-mitti-dark-brown mb-2">
        Why Stay with MITTI?
      </h2>
      <p className="text-md sm:text-xl text-mitti-dark-brown">
        We partner with rural hosts to bring you India as it truly is - unfiltered, unforgettable.
      </p>
      <div className="flex justify-center">
        <MagicBento
          textAutoHide
          enableStars
          enableSpotlight
          enableBorderGlow
          disableAnimations={false}
          spotlightRadius={1000}
          particleCount={50}
          enableTilt
          glowColor="139, 69, 19" 
          clickEffect
          enableMagnetism
        />
      </div>
    </section>
  );
};

export default WhyMittiSection;
