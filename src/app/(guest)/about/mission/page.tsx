"use client";

import SmartLink from "@/components/shared/SmartLink";
import { motion, cubicBezier } from "framer-motion";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function MissionPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <motion.section
        className="px-6 py-16 flex justify-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="max-w-4xl w-full">
          <motion.div variants={fadeUp} className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Our Mission
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Making rural tourism<br/> accessible, ethical, and simple
            </h1>
          </motion.div>

          <motion.div className="space-y-10" variants={stagger}>
            {[
              "MITTI’s mission is to enable meaningful connections between travellers and rural communities through authentic homestay experiences.",
              "The platform is designed to reduce technical barriers for rural homestay owners by providing tools that are simple to understand, easy to manage, and practical to use without advanced digital skills.",
              "For travellers, MITTI aims to offer verified listings, transparent information, and clear expectations, helping them explore destinations beyond urban and commercial tourism.",
              "Above all, MITTI seeks to demonstrate how technology can be used responsibly to support rural livelihoods, preserve local culture, and encourage sustainable tourism practices.",
            ].map((text) => (
              <motion.p
                key={text}
                variants={fadeUp}
                className="text-lg text-mitti-dark-brown/80 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 pt-6 border-t border-mitti-dark-brown/20 text-center"
          >
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
              {[
                { href: "/about/vision", label: "Vision" },
                { href: "/about/objectives", label: "Objectives" },
                { href: "/about/who-we-are", label: "Who We Are" },
              ].map((link) => (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-mitti-brown after:transition-transform hover:after:scale-x-100"
                >
                  {link.label}
                </SmartLink>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

