"use client";

import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ObjectivesPage() {
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
              Objectives
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Clear goals guiding the platform
            </h1>
          </motion.div>

          <motion.div className="space-y-8" variants={stagger}>
            {[
              "To provide rural homestay owners with a simple and intuitive platform to list, manage, and showcase their properties without technical complexity.",
              "To help travellers discover authentic rural stays through verified listings, transparent information, and clearly defined policies.",
              "To promote ethical and responsible tourism practices that respect local communities, culture, and livelihoods.",
              "To apply software engineering principles in solving a real-world problem, demonstrating how technology can be designed with social awareness and practical impact.",
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
                { href: "/about/who-we-are", label: "Who We Are" },
                { href: "/about/mission", label: "Mission" },
                { href: "/about/vision", label: "Vision" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-mitti-brown after:transition-transform hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
