import { Grid } from "lucide-react";
import Image from "next/image";

interface GalleryGridProps {
  images: string[];
  name: string;
  onOpen: () => void;
}

export default function GalleryGrid({
  images,
  name,
  onOpen,
}: GalleryGridProps) {
  const mainImage = images[0];
  const secondaryImages = images.slice(1, 5);

  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[420px] overflow-hidden rounded-2xl">
        {/* Main image */}
        <div className="relative md:col-span-2 h-full">
          <Image
            src={mainImage}
            alt={name}
            fill
            priority
            className="object-cover transition hover:brightness-90 cursor-pointer"
            onClick={onOpen}
          />
        </div>

        {/* Secondary images */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
          {secondaryImages.map((img, index) => (
            <div key={index} className="relative">
              <Image
                src={img}
                alt={name}
                fill
                className="object-cover transition hover:brightness-90 cursor-pointer"
                onClick={onOpen}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Show all photos button */}
      <button
        onClick={onOpen}
        className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition flex items-center gap-2 border border-mitti-dark-brown/70 cursor-pointer hover:bg-mitti-beige"
      >
        <Grid />
        Show all photos
      </button>
    </section>
  );
}
