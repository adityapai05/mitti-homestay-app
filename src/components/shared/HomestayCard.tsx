import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface HomestayCardProps {
  title: string;
  description: string;
  price?: number;
  rating?: number;
  imageSrc: string;
  href?: string;
  actionLabel?: string;
  children?: ReactNode;
  size?: "default" | "compact"; // New prop for size variants

  // Optional style overrides
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  buttonClassName?: string;
}

const HomestayCard = ({
  title,
  description,
  price,
  rating,
  imageSrc,
  href,
  actionLabel = "Book Now",
  children,
  size = "default", 
  className,
  imageClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  buttonClassName,
}: HomestayCardProps) => {
  const sizeClasses = {
    default: {
      container: "w-full sm:max-w-xs",
      image: "h-40 sm:h-48 md:h-56",
      title: "text-lg sm:text-xl",
      description: "text-sm sm:text-base min-h-[40px]",
      price: "text-sm sm:text-base",
      button: "text-sm sm:text-base px-4 py-2",
      padding: "p-4"
    },
    compact: {
      container: "w-full max-w-[280px] mx-auto",
      image: "h-32 sm:h-40",
      title: "text-sm sm:text-base",
      description: "text-xs sm:text-sm min-h-[28px]",
      price: "text-xs sm:text-sm",
      button: "text-xs sm:text-sm px-3 py-1.5",
      padding: "p-3"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={clsx(
        "flex flex-col justify-between h-full rounded-xl overflow-hidden bg-white text-left shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 hover:scale-105",
        currentSize.container,
        className
      )}
    >
      <div
        className={clsx("relative w-full", currentSize.image, imageClassName)}
      >
        <Image
          src={imageSrc || "/mitti-logo.png"}
          alt={title}
          fill
          className="object-cover"
          sizes={size === "compact" ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 768px) 100vw, 320px"}
        />
      </div>

      <div className={clsx("flex flex-col flex-1", currentSize.padding)}>
        <h3
          className={clsx(
            "font-semibold text-mitti-dark-brown mb-1",
            currentSize.title,
            titleClassName
          )}
        >
          {title}
        </h3>

        <p
          className={clsx(
            "text-mitti-dark-brown/80 mb-3 line-clamp-2",
            currentSize.description,
            descriptionClassName
          )}
          title={description}
        >
          {description}
        </p>

        {(price !== undefined || rating !== undefined) && (
          <div
            className={clsx(
              "flex items-center justify-between mb-3 mt-auto",
              footerClassName
            )}
          >
            {price !== undefined && (
              <p className={currentSize.price}>
                <span className="font-bold text-mitti-dark-brown">
                  ₹{price}
                </span>{" "}
                <span className="text-mitti-dark-brown/70">/night</span>
              </p>
            )}

            {rating !== undefined && (
              <div className="flex items-center gap-1 text-mitti-dark-brown">
                <Star size={size === "compact" ? 14 : 16} className="fill-yellow-400 stroke-yellow-400" />
                <span className={clsx("font-medium", size === "compact" ? "text-xs" : "text-sm")}>{rating}</span>
              </div>
            )}
          </div>
        )}

        {children ? (
          children
        ) : (
          <Link
            href={href || "#"}
            className={clsx(
              "block w-full text-center text-white bg-mitti-dark-brown rounded-lg font-semibold hover:bg-opacity-90 cursor-pointer",
              currentSize.button,
              buttonClassName
            )}
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomestayCard;