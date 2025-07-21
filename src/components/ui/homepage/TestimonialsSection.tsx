"use client";

import React from "react";
import InfiniteScroll from "@/components/ui/prebuilt-components/InfiniteScroll";
import { Quote } from "lucide-react";

const testimonials = [
  "Mitti helped us discover hidden gems in rural India. A truly soulful experience!",
  "Booking was smooth and the host family treated us like their own.",
  "Loved the authenticity and simplicity – it was unforgettable!",
  "Support team was very helpful throughout the journey.",
  "Traveling with MITTI made me realize how beautiful our villages are.",
];

const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="bg-mitti-beige text-mitti-dark-brown py-12 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            Hear from Our <br />
            Happy Guests
          </h2>
          <p className="text-lg md:text-xl max-w-lg mx-auto md:mx-0">
            MITTI is more than just a booking platform-it's a bridge to cultural
            discovery, warmth, and connection. See how travelers have
            experienced the real India through our homestays.
          </p>
        </div>

        <div className="w-full h-[500px] relative overflow-hidden bg-mitti-brown rounded-3xl shadow-xl p-4">
          <InfiniteScroll
            items={testimonials.map((text) => ({
              content: (
                <div className="relative bg-mitti-khaki p-6 rounded-2xl shadow-md text-mitti-dark-brown text-base md:text-lg font-medium flex items-start gap-4">
                  <Quote className="w-6 h-6 text-mitti-brown flex-shrink-0" />
                  <p>{text}</p>
                </div>
              ),
            }))}
            itemMinHeight={100}
            autoplay
            autoplaySpeed={0.4}
            autoplayDirection="up"
            pauseOnHover
            isTilted
            tiltDirection="right"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
