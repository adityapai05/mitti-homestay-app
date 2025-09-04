import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/prebuilt-components/carousel';
import { Homestay } from '@/types';
import Image from 'next/image';

interface HeroSectionProps {
  homestay: Homestay;
}

const HeroSection: React.FC<HeroSectionProps> = ({ homestay }) => {
  // Fallback images if none provided
  const images = homestay.imageUrl.length > 0 ? homestay.imageUrl : [
    '/mitti-logo.png',
    '/mitti-logo.png',
    '/mitti-logo.png',
    '/mitti-logo.png'
  ];

  return (
    <div className="relative w-full h-[500px] max-w-7xl mx-auto">
      {/* Carousel */}
      <Carousel className="w-full h-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[500px]">
                <Image
                  src={image}
                  alt={`${homestay.name} image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  priority={index === 0} // Optimize first image
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-mitti-brown text-mitti-cream p-2 rounded-full hover:bg-mitti-brown/80"
          aria-label="Previous image"
        />
        <CarouselNext
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-mitti-brown text-mitti-cream p-2 rounded-full hover:bg-mitti-brown/80"
          aria-label="Next image"
        />
      </Carousel>

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-mitti-dark-brown/80 to-transparent w-full text-white">
        <h1 className="text-4xl font-bold">{homestay.name}</h1>
        <p className="text-lg">{homestay.address}</p>
        <div className="flex items-center mt-2">
          <span className="text-mitti-brown">
            ★ {homestay.rating.toFixed(1)}
          </span>
          <span className="ml-2">
            ({homestay.reviewCount} reviews)
          </span>
        </div>
        <span className="inline-block mt-2 px-3 py-1 bg-mitti-olive rounded-full text-sm">
          {homestay.category}
        </span>
      </div>
    </div>
  );
};

export default HeroSection;