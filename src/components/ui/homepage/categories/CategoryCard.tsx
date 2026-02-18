"use client";

import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import { motion, cubicBezier } from "framer-motion";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

interface CategoryCardProps {
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
}

const CategoryCard = ({
  categoryKey,
  title,
  subtitle,
  image,
}: CategoryCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT },
        },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <SmartLink
        href={`/explore?category=${categoryKey}`}
        className="group relative block w-full overflow-hidden rounded-3xl aspect-[4/5]"
      >
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-6 bottom-6">
          <h3 className="text-2xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-white/85 text-sm leading-relaxed">{subtitle}</p>

          <div className="mt-4 h-px w-8 bg-white/60 transition-all duration-300 group-hover:w-14" />
        </div>
      </SmartLink>
    </motion.div>
  );
};

export default CategoryCard;

