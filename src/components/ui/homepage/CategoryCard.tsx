import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  filterKey?: string;
  className?: string;
}

const CategoryCard = ({
  title,
  subtitle,
  imageSrc,
  filterKey,
  className,
}: CategoryCardProps) => {
  const href = filterKey ? `/explore?category=${filterKey}` : "#";

  return (
    <Link
      href={href}
      className={clsx(
        "group block w-full overflow-hidden rounded-3xl bg-white",
        "shadow-md hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 300px"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white leading-tight">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/90">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
