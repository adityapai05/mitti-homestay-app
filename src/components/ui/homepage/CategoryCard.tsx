import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  filterKey?: string;
}

const CategoryCard = ({
  title,
  subtitle,
  imageSrc,
  filterKey,
}: CategoryCardProps) => {
  const href = filterKey ? `/?category=${filterKey}` : "#";

  return (
    <Link
      href={href}
      className="group rounded-2xl overflow-hidden bg-gradient-to-br from-mitti-cream to-mitti-beige text-left shadow-lg hover:shadow-2xl transition-all duration-400 w-full sm:w-60 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-mitti-dark-brown focus:ring-offset-2"
      aria-label={`Explore ${title} - ${subtitle}`}
    >
      <div className="relative h-56 w-full sm:h-64">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-400 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 288px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mitti-dark-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>

      <div className="bg-white/95 backdrop-blur-sm px-5 py-4 flex flex-col min-h-[100px]">
        <h3 className="text-xl font-bold text-mitti-dark-brown mb-2 group-hover:text-mitti-brown transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        <p className="text-base text-mitti-muted leading-snug line-clamp-2">
          {subtitle}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
