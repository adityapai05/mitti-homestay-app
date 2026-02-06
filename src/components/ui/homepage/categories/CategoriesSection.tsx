"use client";

import { motion, cubicBezier } from "framer-motion";
import CategoryCard from "./CategoryCard";

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
  visible: { transition: { staggerChildren: 0.12 } },
};

export const CATEGORY_CARDS = [
  {
    categoryKey: "MOUNTAIN_RETREAT",
    title: "Mountain Retreat",
    subtitle: "Cool air, misty mornings, quiet nights",
    image: "/categories/mountains.png",
  },
  {
    categoryKey: "FARM_STAY",
    title: "Farm Stay",
    subtitle: "Fields, fresh food, slow mornings",
    image: "/categories/farm.png",
  },
  {
    categoryKey: "ECO_LODGE",
    title: "Eco Lodge",
    subtitle: "Minimal living, maximum nature",
    image: "/categories/forest.png",
  },
  {
    categoryKey: "TRADITIONAL_HOME",
    title: "Traditional Home",
    subtitle: "Local architecture, lived stories",
    image: "/categories/traditional.png",
  },
  {
    categoryKey: "LAKESIDE",
    title: "Lakeside",
    subtitle: "Still waters, unhurried days",
    image: "/categories/river.png",
  },
];

const CategoriesSection = () => {
  return (
    <motion.section
      className="bg-mitti-beige px-6 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
            Experiences
          </p>
          <h2 className="text-3xl sm:text-6xl font-semibold text-mitti-dark-brown mb-2 sm:mb-4">
            Explore by experience
          </h2>
          <p className="text-mitti-dark-brown/80 sm:text-lg max-w-2xl mx-auto">
            Each stay offers a different rhythm of rural life. <br/>Choose how you
            want to experience Bharat.
          </p>
        </motion.div>

        {/* Mobile and tablet scroll */}
        <motion.div
          className="flex gap-8 overflow-x-auto pb-4 -mx-6 px-6 lg:hidden no-scrollbar"
          variants={stagger}
        >
          {CATEGORY_CARDS.map((category) => (
            <div
              key={category.categoryKey}
              className="min-w-[260px] sm:min-w-[300px] flex-shrink-0"
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </motion.div>

        {/* Desktop grid */}
        <motion.div
          className="hidden lg:grid grid-cols-5 gap-6"
          variants={stagger}
        >
          {CATEGORY_CARDS.map((category) => (
            <CategoryCard key={category.categoryKey} {...category} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CategoriesSection;
