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

export default function WhoWeArePage() {
  return (
    <main className="bg-mitti-beige w-full">
      <motion.section
        className="px-6 py-16 flex justify-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Who We Are
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Built with intention, grounded in context
            </h1>
          </motion.div>

          {/* Content */}
          <motion.div className="space-y-10" variants={stagger}>
            {[
              "MITTI is a student-built platform created as part of the Bachelor of Science in Information Technology program. It was developed with a strong focus on applying software engineering principles to a real-world problem rooted in social and regional context.",
              "The project is guided by academic learning, technical exploration, and a clear intent to design responsibly. Instead of replicating large commercial platforms, MITTI focuses on simplicity, transparency, and usability for users who may not be digitally fluent.",
              "MITTI is built for two primary groups. Rural homestay owners who want a simple way to list and manage their properties, and travellers who seek authentic stays beyond urban and commercial tourism experiences.",
              "This platform does not aim to disrupt existing systems or replace established marketplaces. It is designed as a focused solution that demonstrates how technology can support rural tourism in an ethical and practical manner.",
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

          {/* Navigation */}
          <motion.div
            variants={fadeUp}
            className="mt-6 pt-6 border-t border-mitti-dark-brown/20 text-center"
          >
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
              {[
                { href: "/about/mission", label: "Mission" },
                { href: "/about/vision", label: "Vision" },
                { href: "/about/objectives", label: "Objectives" },
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
