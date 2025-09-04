import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Homestay } from "@/types";

interface HostInfoSectionProps {
  homestay: Homestay;
}

const HostInfoSection: React.FC<HostInfoSectionProps> = ({ homestay }) => {
  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Host Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src={homestay.owner.image || "/placeholder-host.jpg"}
                alt={`Host ${homestay.owner.name}`}
                fill
                className="rounded-full object-cover border border-mitti-khaki"
              />
            </div>
            <h2 className="text-2xl font-semibold text-mitti-dark-brown">
              Hosted by {homestay.owner.name}
            </h2>
          </div>

          {/* Right: Contact Host */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-mitti-brown text-white rounded-full hover:bg-mitti-brown/90 transition cursor-pointer"
            aria-label="Contact host"
          >
            <MessageCircle size={18} />
            Contact Host
          </button>
        </div>
      </div>
    </section>
  );
};

export default HostInfoSection;
