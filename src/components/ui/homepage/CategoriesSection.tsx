import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "Mountain Retreats",
    subtitle: "Cool air, misty mornings, quiet nights",
    imageSrc: "/categories/mountains.png",
    filterKey: "MOUNTAIN_RETREAT",
  },
  {
    title: "Farm Stays",
    subtitle: "Wake up to fields and fresh air",
    imageSrc: "/categories/farm.png",
    filterKey: "FARM_STAY",
  },
  {
    title: "Forest Hideaways",
    subtitle: "Stay surrounded by untouched nature",
    imageSrc: "/categories/forest.png",
    filterKey: "FOREST_STAY",
  },
  {
    title: "Riverside Homes",
    subtitle: "Slow days by flowing waters",
    imageSrc: "/categories/river.png",
    filterKey: "RIVER_SIDE",
  },
];

const CategoriesSection = () => {
  return (
    <section className="bg-mitti-beige pt-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-7">
          <h2 className="text-3xl sm:text-6xl font-bold text-mitti-dark-brown mb-2">
            Explore by Experience
          </h2>
          <p className="text-md sm:text-xl text-mitti-dark-brown">
            Each stay offers a different rhythm of rural life. Choose how
            you want to experience Bharat.
          </p>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden gap-6 overflow-x-auto no-scrollbar px-1">
          {categories.map((cat) => (
            <div key={cat.title} className="min-w-[260px] flex-shrink-0">
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
