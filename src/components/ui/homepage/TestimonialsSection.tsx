"use client";

import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "@/components/ui/prebuilt-components/InfiniteScroll";
import { Quote, Star, MapPin } from "lucide-react";

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

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch testimonials");

        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch (error) {
        console.error("[TestimonialsSection]", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);


  /* ---------------- helpers ---------------- */

  const renderStars = (rating: number) => (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          size={14}
          className={
            v <= rating
              ? "fill-mitti-olive text-mitti-olive"
              : "text-mitti-khaki/40"
          }
        />
      ))}
    </div>
  );

  /* ---------------- loading (motion based) ---------------- */

  if (loading) {
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
              Loading real stories from our guests across rural India.
            </p>
          </div>

          <div className="w-full h-[420px] bg-mitti-brown rounded-3xl shadow-xl p-4 overflow-hidden flex flex-col gap-4 animate-pulse">
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- empty state ---------------- */

  if (testimonials.length === 0) {
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
              Stories from our travellers will appear here as journeys unfold.
            </p>
          </div>

          <div className="w-full h-[420px] bg-mitti-brown rounded-3xl shadow-xl p-6 flex items-center justify-center text-center">
            <div className="max-w-sm">
              <Quote className="w-10 h-10 mx-auto mb-4 text-mitti-khaki" />
              <p className="text-mitti-khaki text-lg font-medium">
                Be among the first to share your story.
              </p>
              <p className="text-mitti-khaki/80 text-sm mt-2">
                Authentic guest experiences will live here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- single review (featured) ---------------- */

  if (testimonials.length === 1) {
    const review = testimonials[0];

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
              A heartfelt experience from one of our early travellers.
            </p>
          </div>

          <div
            ref={panelRef}
            className="w-full h-[420px] bg-mitti-brown rounded-3xl shadow-xl p-6 flex items-center justify-center"
          >
            <div className="max-w-md bg-mitti-khaki p-6 rounded-2xl shadow-md flex gap-4">
              <Quote className="w-6 h-6 text-mitti-brown flex-shrink-0" />
              <div>
                {renderStars(review.rating)}
                <p className="mb-3 text-lg">“{review.comment}”</p>
                <div className="flex items-center gap-2 text-sm text-mitti-dark-brown/80">
                  <MapPin size={14} />
                  <span>
                    {review.user.name} · {review.homestay.name}
                    {review.homestay.state ? `, ${review.homestay.state}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- multiple reviews (scroll) ---------------- */

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
            Real voices from travellers who discovered rural India with MITTI.
          </p>
        </div>

        <div
          ref={panelRef}
          className="w-full h-[420px] relative overflow-hidden bg-mitti-brown rounded-3xl shadow-xl p-4"
        >
          <InfiniteScroll
            items={testimonials.map((review) => ({
              content: (
                <div className="bg-mitti-khaki p-6 rounded-2xl shadow-md flex gap-4">
                  <Quote className="w-6 h-6 text-mitti-brown flex-shrink-0" />
                  <div>
                    {renderStars(review.rating)}
                    <p className="mb-3 text-base md:text-lg">
                      “{review.comment}”
                    </p>
                    <div className="flex items-center gap-2 text-sm text-mitti-dark-brown/80">
                      <MapPin size={14} />
                      <span>
                        {review.user.name} · {review.homestay.name}
                        {review.homestay.state
                          ? `, ${review.homestay.state}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            }))}
            itemMinHeight={130}
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
