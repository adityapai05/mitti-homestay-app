import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface HomestayCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  rating?: number;
  imageSrc: string[];
  href?: string;
  actionLabel?: string;
  children?: ReactNode;
  size?: "default" | "compact";
  isVerified?: boolean;
  category?: string;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  buttonClassName?: string;
}

const HomestayCard = ({
  id,
  title,
  description,
  price,
  rating,
  imageSrc,
  href = `/homestays/${id}`,
  actionLabel = "Book Now",
  children,
  size = "default",
  isVerified = false,
  category,
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
      image: "h-42 sm:h-46 md:h-52",
      title: "text-xl sm:text-2xl",
      description: "text-base sm:text-lg min-h-[48px]",
      price: "text-base sm:text-lg",
      button: "text-base sm:text-lg px-6 py-3",
      padding: "p-5",
    },
    compact: {
      container: "w-full max-w-[280px] mx-auto",
      image: "h-32 sm:h-40",
      title: "text-sm sm:text-base",
      description: "text-xs sm:text-sm min-h-[28px]",
      price: "text-xs sm:text-sm",
      button: "text-xs sm:text-sm px-3 py-1.5",
      padding: "p-3",
    },
  };

  const currentSize = sizeClasses[size];
  const imageSource =
    Array.isArray(imageSrc) && imageSrc.length > 0
      ? imageSrc[0]
      : "/mitti-logo.png";

  return (
    <div
      className={clsx(
        "flex flex-col justify-between h-full rounded-2xl overflow-hidden bg-gradient-to-br from-mitti-cream to-mitti-beige text-left shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-3 hover:scale-[1.03] border border-mitti-khaki/20",
        currentSize.container,
        className
      )}
    >
      <div
        className={clsx("relative w-full", currentSize.image, imageClassName)}
      >
        <Image
          src={imageSource}
          alt={title}
          fill
          className="object-cover transition-transform duration-400 hover:scale-105"
          sizes={
            size === "compact"
              ? "(max-width: 768px) 50vw, 25vw"
              : "(max-width: 768px) 100vw, 320px"
          }
        />
        {(isVerified || category) && (
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {isVerified && (
              <span className="bg-mitti-olive text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md">
                Verified
              </span>
            )}
            {category && (
              <span className="bg-mitti-khaki text-mitti-dark-brown text-sm px-3 py-1 rounded-full font-semibold shadow-md">
                {category}
              </span>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mitti-dark-brown/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-400" />
      </div>

      <div
        className={clsx(
          "flex flex-col flex-1",
          currentSize.padding,
          "bg-white/90 backdrop-blur-sm"
        )}
      >
        <h3
          className={clsx(
            "font-bold text-mitti-dark-brown mb-1 leading-tight",
            currentSize.title,
            titleClassName
          )}
        >
          {title}
        </h3>

        <p
          className={clsx(
            "text-mitti-muted mb-3 line-clamp-2",
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
              "flex items-center justify-between mb-3 border-t border-mitti-khaki/20 pt-3",
              footerClassName
            )}
          >
            {price !== undefined && (
              <p className={currentSize.price}>
                <span className="font-bold text-mitti-dark-brown">
                  ₹{price}
                </span>{" "}
                <span className="text-mitti-muted">/night</span>
              </p>
            )}

            {rating !== undefined && (
              <div className="flex items-center gap-1.5 text-mitti-dark-brown">
                <Star
                  size={size === "compact" ? 16 : 18}
                  className="fill-yellow-500 stroke-yellow-500"
                />
                <span
                  className={clsx(
                    "font-semibold",
                    size === "compact" ? "text-sm" : "text-base"
                  )}
                >
                  {rating}
                </span>
              </div>
            )}
          </div>
        )}

        {children ? (
          children
        ) : (
          <Link
            href={href}
            className={clsx(
              "block w-full text-center text-white bg-mitti-olive rounded-xl font-semibold hover:bg-mitti-brown transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-mitti-olive focus:ring-offset-2",
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
