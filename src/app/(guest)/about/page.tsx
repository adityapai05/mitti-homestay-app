"use client";

import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import {
  Compass,
  Handshake,
  ShieldCheck,
  Leaf,
  Eye,
  Heart,
  Cpu,
} from "lucide-react";
import { motion, cubicBezier } from "framer-motion";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function AboutPage() {
  return (
    <main className="bg-mitti-beige w-full">
      {/* Hero */}
      <section className="relative w-full h-[65vh] sm:h-[70vh] overflow-hidden">
        <Image
          src="/about-hero.png"
          alt="Rural India landscape at dawn"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-mitti-dark-brown/70" />

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="max-w-5xl text-center">
            <p className="text-sm tracking-widest text-mitti-khaki uppercase mb-4">
              About MITTI
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-mitti-beige mb-6">
              Rooted in Rural India
            </h1>
            <p className="text-lg sm:text-xl text-mitti-beige/90 max-w-3xl mx-auto leading-relaxed">
              Connecting travellers with authentic rural homestays, local
              communities, and real experiences across Bharat.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Narrative */}
      <motion.section
        className="px-6 py-14 sm:py-20 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-5xl relative">
          <span className="absolute -top-16 -left-7 text-[120px] font-serif text-mitti-brown/25 select-none">
            “
          </span>

          <p className="text-xl sm:text-3xl text-mitti-dark-brown leading-relaxed max-w-4xl">
            Rural India offers warmth, culture, and authenticity that rarely
            appear on mainstream travel platforms.
          </p>

          <p className="mt-8 text-mitti-dark-brown/80 leading-relaxed max-w-4xl text-justify">
            Yet many homestays remain digitally invisible due to complex systems
            and urban-centric design. MITTI was built to bridge this gap by
            focusing on clarity over complexity, trust over volume, and people
            over platforms.
          </p>
        </div>
      </motion.section>

      {/* Capabilities */}
      <motion.section
        className="px-6 py-10 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Compass,
              title: "Discover",
              text: "Explore verified rural homestays offering genuine local experiences across India.",
            },
            {
              icon: Handshake,
              title: "Empower",
              text: "Enable homestay owners to list and manage properties without technical barriers.",
            },
            {
              icon: ShieldCheck,
              title: "Build Trust",
              text: "Create confidence through verification, transparent policies, and clear communication.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <item.icon className="text-mitti-brown mb-4" />
              <h3 className="text-xl font-semibold text-mitti-dark-brown mb-3">
                {item.title}
              </h3>
              <p className="text-mitti-dark-brown/80 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Rural First */}
      <motion.section
        className="px-6 py-14 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-6xl bg-mitti-cream rounded-2xl p-10 sm:p-14">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="text-mitti-brown" />
            <h2 className="text-2xl font-semibold text-mitti-dark-brown">
              A Rural-First Approach
            </h2>
          </div>

          <p className="text-mitti-dark-brown/80 leading-relaxed max-w-4xl text-justify">
            MITTI is designed with an understanding of rural realities such as
            limited digital familiarity and inconsistent connectivity. The
            platform avoids unnecessary features and prioritizes usability.
          </p>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        className="px-6 py-10 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              icon: Eye,
              title: "Transparency",
              text: "Honest information, clear policies, and visible expectations.",
            },
            {
              icon: Cpu,
              title: "Purposeful Technology",
              text: "Technology used as a support system, not a barrier.",
            },
            {
              icon: Heart,
              title: "Respect",
              text: "Deep respect for local communities, culture, and livelihoods.",
            },
            {
              icon: ShieldCheck,
              title: "Simplicity",
              text: "Clear flows and minimal friction instead of feature overload.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <item.icon className="text-mitti-brown mb-3" />
              <h3 className="text-lg font-semibold text-mitti-dark-brown mb-2">
                {item.title}
              </h3>
              <p className="text-mitti-dark-brown/80">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Navigation */}
      <motion.section
        className="px-6 py-16 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-6xl text-center w-full">
          <div className="h-px bg-mitti-dark-brown/20 mb-12" />

          <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-8">
            Explore more about MITTI
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-lg font-medium text-mitti-brown">
            {[
              { href: "/about/who-we-are", label: "Who We Are" },
              { href: "/about/mission", label: "Mission" },
              { href: "/about/vision", label: "Vision" },
              { href: "/about/objectives", label: "Objectives" },
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
        </div>
      </motion.section>
    </main>
  );
}

