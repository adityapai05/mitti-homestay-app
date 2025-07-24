import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

interface HomestayCardProps {
  title: string;
  description: string;
  price: number;
  rating: number;
  imageSrc: string;
}

const HomestayCard = ({
  title,
  description,
  price,
  rating,
  imageSrc,
}: HomestayCardProps) => {
  return (
    <div className="flex flex-col justify-between h-full rounded-xl overflow-hidden bg-white text-left shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 hover:scale-105 w-full sm:max-w-xs ">
      <div className="relative h-40 sm:h-48 md:h-56 w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-mitti-dark-brown mb-1">
          {title}
        </h3>
        <p
          className="text-sm sm:text-base text-mitti-dark-brown/80 mb-3 min-h-[40px] line-clamp-2"
          title={description}
        >
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 mt-auto">
          <p className="text-sm sm:text-base">
            <span className="font-bold text-mitti-dark-brown">₹{price}</span>{" "}
            <span className="text-mitti-dark-brown/70">/night</span>
          </p>
          <div className="flex items-center gap-1 text-mitti-dark-brown">
            <Star size={16} className="fill-yellow-400 stroke-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        <Link
          href="#"
          className="block w-full text-center text-white bg-mitti-dark-brown px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 text-sm sm:text-base cursor-pointer"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default HomestayCard;
