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
      className="rounded-xl overflow-hidden bg-white text-left shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 hover:scale-105 w-full sm:w-64 flex flex-col cursor-pointer"
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>

      <div className="bg-mitti-dark-brown text-white px-4 py-3 flex flex-col min-h-[92px]">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90 leading-tight">{subtitle}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
