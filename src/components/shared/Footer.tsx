"use client";

import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import { motion, cubicBezier } from "framer-motion";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const footerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
      staggerChildren: 0.08,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
};

const linkHover =
  "relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-mitti-beige after:transition-transform after:duration-300 hover:after:scale-x-100";

const Footer = () => {
  return (
    <motion.footer
      className="bg-mitti-brown text-mitti-beige pt-12 pb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-14">
          {/* Brand */}
          <motion.div
            variants={columnVariants}
            className="lg:col-span-2 space-y-6"
          >
            <SmartLink href="/" className="inline-block">
              <div className="inline-flex items-center rounded-2xl bg-mitti-beige/95 px-4 py-3">
                <Image
                  src="/mitti-logo.png"
                  alt="MITTI logo"
                  width={140}
                  height={44}
                  className="object-contain"
                  priority
                />
              </div>
            </SmartLink>

            <p className="max-w-md text-base leading-relaxed text-mitti-beige/90">
              MITTI is a rural homestay platform focused on helping travelers
              experience India slowly and honestly, while supporting local
              families through meaningful tourism.
            </p>
          </motion.div>

          {/* About */}
          <motion.div variants={columnVariants} className="space-y-5">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-mitti-beige/75">
              About
            </h4>
            <ul className="space-y-3 text-base">
              <li>
                <SmartLink href="/about" className={linkHover}>
                  About MITTI
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/about/who-we-are" className={linkHover}>
                  Who We Are
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/about/mission" className={linkHover}>
                  Mission
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/about/vision" className={linkHover}>
                  Vision
                </SmartLink>
              </li>
            </ul>
          </motion.div>

          {/* Explore */}
          <motion.div variants={columnVariants} className="space-y-5">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-mitti-beige/75">
              Explore
            </h4>
            <ul className="space-y-3 text-base">
              <li>
                <SmartLink href="/explore" className={linkHover}>
                  Homestays
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/host/start" className={linkHover}>
                  Become a Host
                </SmartLink>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={columnVariants} className="space-y-5">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-mitti-beige/75">
              Support
            </h4>
            <ul className="space-y-3 text-base">
              <li>
                <SmartLink href="/contact" className={linkHover}>
                  Contact
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/cancellation-policy" className={linkHover}>
                  Cancellation Policy
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/terms-of-service" className={linkHover}>
                  Terms of Service
                </SmartLink>
              </li>
              <li>
                <SmartLink href="/privacy-policy" className={linkHover}>
                  Privacy Policy
                </SmartLink>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-mitti-beige/20" />

        {/* Bottom bar */}
        <div className="flex items-center justify-center text-md text-mitti-beige/75">
          © 2025 <span className="mx-1 font-medium">MITTI</span>. All rights
          reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

