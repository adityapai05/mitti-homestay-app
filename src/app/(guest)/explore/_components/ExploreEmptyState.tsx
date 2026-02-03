"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ExploreEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mitti-khaki/30">
        <MapPin className="h-7 w-7 text-mitti-dark-brown" />
      </div>

      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        No homestays found
      </h2>

      <p className="mt-2 max-w-md text-sm text-mitti-dark-brown">
        We could not find homestays matching your filters. Try adjusting the
        location, price range, or amenities to explore more rural stays.
      </p>
    </motion.div>
  );
}
