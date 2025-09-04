import { Homestay } from '@/types';

interface DescriptionSectionProps {
  homestay: Homestay;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ homestay }) => {
  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
          About this Homestay
        </h2>
        <p className="text-mitti-dark-brown text-lg leading-relaxed">
          {homestay.description}
        </p>
      </div>
    </section>
  );
};

export default DescriptionSection;