"use client";

import { useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { Leaf, Home, HandHeart, Clock, MapPin, Sparkles } from "lucide-react";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

const WHY_MITTI_ITEMS = [
  {
    title: "Rooted in real culture",
    description:
      "Stay inside living villages where traditions, food, and daily life unfold naturally.",
    icon: Leaf,
    image: "/why-mitti/culture.png",
  },
  {
    title: "Hosted by locals",
    description:
      "Real homes, real families. Your hosts share stories, not scripted hospitality.",
    icon: Home,
    image: "/why-mitti/host.png",
  },
  {
    title: "Fair for hosts",
    description:
      "Transparent pricing ensures rural hosts earn with dignity and stability.",
    icon: HandHeart,
    image: "/why-mitti/fair.png",
  },
  {
    title: "Slow, meaningful travel",
    description:
      "Unrushed mornings, quiet evenings, and time that finally feels yours.",
    icon: Clock,
    image: "/why-mitti/slow.png",
  },
  {
    title: "Curated, not crowded",
    description:
      "Handpicked homestays away from mass tourism and over-commercialization.",
    icon: MapPin,
    image: "/why-mitti/curated.png",
  },
  {
    title: "Built with intention",
    description:
      "MITTI is designed to respect people, land, and culture for the long term.",
    icon: Sparkles,
    image: "/why-mitti/intention.png",
  },
];

const WhyMittiSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveIcon = WHY_MITTI_ITEMS[activeIndex].icon;

  return (
    <section className="bg-mitti-beige px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
            Our philosophy
          </p>
          <h2 className="text-3xl sm:text-6xl font-semibold text-mitti-dark-brown mb-4">
            Why stay with MITTI
          </h2>
          <p className="text-mitti-dark-brown/80 sm:text-lg max-w-2xl mx-auto">
            Travel that feels honest, human, and deeply connected to the land
            and the people who live there.
          </p>
        </div>

        {/* Mobile stays same */}
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6">
            {WHY_MITTI_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative min-w-[300px] h-[420px] rounded-3xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
                  <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-mitti-dark-brown">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop interactive focus */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="col-span-7 relative h-[520px] rounded-3xl overflow-hidden">
            <motion.div
              key={WHY_MITTI_ITEMS[activeIndex].image}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fade}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${WHY_MITTI_ITEMS[activeIndex].image})`,
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Selector list */}
          <div className="col-span-5 space-y-6">
            {WHY_MITTI_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeIndex;

              return (
                <button
                  key={item.title}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left flex gap-4 items-start transition-all ${
                    active ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <div
                    className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      active
                        ? "bg-mitti-brown/15 text-mitti-dark-brown"
                        : "bg-mitti-brown/5 text-mitti-dark-brown"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-mitti-dark-brown mb-1">
                      {item.title}
                    </h3>
                    {active && (
                      <p className="text-mitti-dark-brown/80 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMittiSection;
