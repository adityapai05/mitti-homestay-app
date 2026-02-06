"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { Star, MapPin, Quote } from "lucide-react";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    image: string | null;
  };
  homestay: {
    name: string;
    village: string | null;
    state: string | null;
  };
}

const fadeSlide = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch (err) {
        console.error("[TestimonialsSection]", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (loading || testimonials.length === 0) {
    return (
      <section className="bg-mitti-beige py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-mitti-dark-brown/70">
            Stories from our guests will appear here.
          </p>
        </div>
      </section>
    );
  }

  const active = testimonials[activeIndex];

  return (
    <section id="testimonials" className="bg-mitti-beige py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
            Guest stories
          </p>
          <h2 className="text-3xl sm:text-6xl font-semibold text-mitti-dark-brown mb-4">
            Voices from the village
          </h2>
          <p className="text-mitti-dark-brown/80 sm:text-lg max-w-2xl mx-auto">
            Real experiences from people who chose to travel differently.
          </p>
        </div>

        {/* Desktop spotlight */}
        <div className="hidden lg:block relative">
          <div className="relative rounded-3xl bg-white/70 backdrop-blur-sm p-16 shadow-sm overflow-hidden">
            {/* Decorative quote */}
            <Quote className="absolute top-10 right-10 w-20 h-20 text-mitti-brown/10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                variants={fadeSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-3xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      size={16}
                      className={
                        v <= active.rating
                          ? "fill-mitti-olive text-mitti-olive"
                          : "text-mitti-khaki/40"
                      }
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-2xl leading-relaxed text-mitti-dark-brown mb-8">
                  “{active.comment}”
                </p>

                {/* Attribution */}
                <div className="flex items-center gap-3 text-mitti-dark-brown/80">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {active.user.name} · {active.homestay.name}
                    {active.homestay.state ? `, ${active.homestay.state}` : ""}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-mitti-brown w-6" : "bg-mitti-brown/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile swipe rail */}
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="min-w-[300px] bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      size={14}
                      className={
                        v <= review.rating
                          ? "fill-mitti-olive text-mitti-olive"
                          : "text-mitti-khaki/40"
                      }
                    />
                  ))}
                </div>

                <p className="text-mitti-dark-brown mb-4">“{review.comment}”</p>

                <div className="flex items-center gap-2 text-sm text-mitti-dark-brown/80">
                  <MapPin size={14} />
                  <span>
                    {review.user.name} · {review.homestay.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
