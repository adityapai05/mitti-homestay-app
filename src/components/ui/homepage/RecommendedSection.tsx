import HomestayCard from "@/components/shared/HomestayCard";

const recommendedHomestays = [
  {
    title: "Himalayan Haven",
    description: "Peaceful retreat in the hills of Uttarakhand",
    price: 2200,
    rating: 4.8,
    imageSrc: "/mitti-logo.png",
  },
  {
    title: "Kerala Backwater Villa",
    description: "Authentic stay amidst coconut groves",
    price: 3000,
    rating: 4.9,
    imageSrc: "/mitti-logo.png",
  },
  {
    title: "Desert Dune Stay",
    description: "Experience the golden sands of Rajasthan",
    price: 1800,
    rating: 4.7,
    imageSrc: "/mitti-logo.png",
  },
];

const RecommendedSection = () => {
  return (
    <section className="bg-mitti-beige pt-12 px-4 text-center">
      <h2 className="text-3xl sm:text-6xl font-bold text-mitti-dark-brown mb-2">
        Handpicked Stays By MITTI
      </h2>
      <p className="text-md sm:text-xl text-mitti-dark-brown mb-8">
        Our most loved rural stays - chosen for their stories, their soul, and the smiles that greet you.
      </p>
      {/* Mobile: horizontal scroll */}
      <div className="flex sm:hidden overflow-x-auto gap-4 no-scrollbar -mx-4 px-8">
        {recommendedHomestays.map((stay) => (
          <div
            key={stay.title}
            className="min-w-[260px] max-w-xs flex-shrink-0"
          >
            <HomestayCard {...stay} />
          </div>
        ))}
      </div>

      {/* Desktop and tablet */}
      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
        {recommendedHomestays.map((stay) => (
          <HomestayCard key={stay.title} {...stay} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
