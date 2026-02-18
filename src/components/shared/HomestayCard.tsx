import Image from "next/image";
import { Star } from "lucide-react";
import clsx from "clsx";
import SmartLink from "@/components/shared/SmartLink";

interface HomestayCardProps {
  id: string;
  title: string;
  description?: string;
  price?: number;
  rating?: number;
  imageSrc: string[];
  href?: string;
  isVerified?: boolean;
  category?: string;
  className?: string;
}

const HomestayCard = ({
  id,
  title,
  price,
  rating,
  imageSrc,
  href = `/homestays/${id}`,
  isVerified,
  category,
  className,
}: HomestayCardProps) => {
  const imageSource =
    imageSrc && imageSrc.length > 0 ? imageSrc[0] : "/mitti-logo.png";

  return (
    <SmartLink
      href={href}
      target="_blank"
      className={clsx(
        "group block w-full overflow-hidden bg-white",
        "rounded-2xl sm:rounded-3xl",
        "shadow-md hover:shadow-xl transition-all duration-300",
        "sm:hover:-translate-y-1",
        "sm:max-w-sm",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSource}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Badges */}
        {(isVerified || category) && (
          <div className="absolute top-4 left-4 flex gap-2">
            {isVerified && (
              <span className="rounded-full bg-mitti-olive/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Verified
              </span>
            )}
            {category && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-mitti-dark-brown backdrop-blur">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white leading-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Price */}
        {price !== undefined && (
          <div className="text-mitti-dark-brown">
            <span className="text-lg font-semibold">₹{price}</span>
            <span className="ml-1 text-sm text-mitti-muted">/night</span>
          </div>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 text-mitti-dark-brown">
            <Star size={16} className="fill-yellow-500 stroke-yellow-500" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </SmartLink>
  );
};

export default HomestayCard;
