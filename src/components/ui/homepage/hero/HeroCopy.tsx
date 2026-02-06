"use client";

import { motion } from "framer-motion";
import GradientText from "@/components/ui/prebuilt-components/GradientText";

const HeroCopy = () => {
  return (
    <div className="pre-hydration-hidden">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-xl sm:max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full bg-mitti-cream/95 backdrop-blur px-3 sm:px-4 py-1.5 mb-4 shadow-sm"
          >
            {/* Olive dot */}
            <div className="relative flex items-center justify-center">
              <motion.span
                className="h-2 w-2 rounded-full bg-mitti-olive relative z-10"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.span
                className="absolute h-4 w-4 rounded-full bg-mitti-olive/30"
                animate={{ scale: [0.8, 1.4], opacity: [0.4, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>

            <span className="text-xs sm:text-sm font-medium text-mitti-dark-brown">
              Authentic Rural Homestays
            </span>
          </motion.div>

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
      </motion.div>
    </div>
  );
};

export default HeroCopy;
