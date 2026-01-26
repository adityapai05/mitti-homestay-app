"use client";

import FadeContent from "@/components/ui/prebuilt-components/FadeContent";
import GradientText from "@/components/ui/prebuilt-components/GradientText";

const HeroCopy = () => {
  return (
    <div className="pre-hydration-hidden">
      <FadeContent duration={600} initialOpacity={0}>
        <div className="max-w-xl sm:max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-mitti-cream/95 backdrop-blur px-3 sm:px-4 py-1.5 mb-4 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-mitti-olive" />
            <span className="text-xs sm:text-sm font-medium text-mitti-dark-brown">
              Authentic Rural Homestays
            </span>
          </div>

          <h1 className="font-extrabold leading-[1.05] text-[clamp(3rem,7vw,4.8rem)] text-mitti-beige">
            Stay in the{" "}
            <GradientText
              colors={["#FF9933", "#FBE8D0", "#138808"]}
              animationSpeed={3}
            >
              Heart of Bharat
            </GradientText>
          </h1>

          <p className="mt-4 sm:mt-5 text-mitti-beige text-base sm:text-lg font-light max-w-xl">
            Discover authentic rural homestays hosted by local families.
            Experience India slowly, honestly, and deeply.
          </p>
        </div>
      </FadeContent>
    </div>
  );
};

export default HeroCopy;
