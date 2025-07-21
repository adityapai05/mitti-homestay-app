import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "Mountain Villages",
    subtitle: "Tranquil stays in Misty Hills",
    imageSrc: "/mitti-logo.png",
    tag: "🏔️",
    filterKey: "mountains",
  },
  {
    title: "Farm Retreats",
    subtitle: "Wake up to fields and fresh air",
    imageSrc: "/mitti-logo.png",
    tag: "🌾",
    filterKey: "farms",
  },
  {
    title: "Forest Hideaways",
    subtitle: "Stay nestled in nature's lap",
    imageSrc: "/mitti-logo.png",
    tag: "🌲",
    filterKey: "forests",
  },
  {
    title: "By the River",
    subtitle: "Serene escapes by flowing waters",
    imageSrc: "/mitti-logo.png",
    tag: "🛶",
    filterKey: "river",
  },
];

const CategoriesSection = () => {
  return (
    <section className="bg-mitti-beige pt-12 px-4 text-center max-w-6xl mx-auto">
      <h2 className="text-3xl sm:text-6xl font-bold text-mitti-dark-brown mb-2">
        Choose Your Journey
      </h2>
      <p className="text-md sm:text-lg text-mitti-dark-brown mb-8">
        From misty mountains to sacred rivers, discover stays that echo the
        rhythm of every region in Bharat.
      </p>

      {/* Mobile */}
      <div className="flex sm:hidden overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory -mx-4 px-8">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="min-w-[260px] max-w-xs flex-shrink-0 "
          >
            <CategoryCard {...cat} />
          </div>
        ))}
      </div>

      {/* Desktop and tablet */}
      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-8">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
