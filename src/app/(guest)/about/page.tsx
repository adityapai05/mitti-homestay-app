import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Handshake,
  ShieldCheck,
  Leaf,
  Eye,
  Heart,
  Cpu,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-mitti-beige">
      {/* Hero */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src="/about-hero.png"
          alt="Rural India landscape at dawn"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-mitti-dark-brown/70" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-5xl text-center">
            <p className="text-sm tracking-widest text-mitti-khaki uppercase mb-4">
              About MITTI
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-mitti-beige mb-6">
              Rooted in Rural India
            </h1>
            <p className="text-lg sm:text-xl text-mitti-beige/90 max-w-3xl mx-auto leading-relaxed">
              Connecting travellers with authentic rural homestays, local
              communities, and real experiences across Bharat.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="px-4 sm:px-6 py-24 flex justify-center">
        <div className="max-w-5xl relative">
          <span className="absolute -top-12 -left-8 text-[140px] leading-none font-serif text-mitti-brown/40 select-none">
            “
          </span>

          <p className="text-2xl sm:text-3xl text-mitti-dark-brown leading-relaxed max-w-4xl">
            Rural India offers warmth, culture, and authenticity that rarely
            appear on mainstream travel platforms.
          </p>

          <p className="mt-8 text-mitti-dark-brown/80 leading-relaxed max-w-4xl">
            Yet many homestays remain digitally invisible due to complex systems
            and urban-centric design. MITTI was built to bridge this gap by
            focusing on clarity over complexity, trust over volume, and people
            over platforms.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-4 sm:px-6 pb-24 flex justify-center">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
          <div>
            <Compass className="text-mitti-brown mb-4" />
            <h3 className="text-xl font-semibold text-mitti-dark-brown mb-3">
              Discover
            </h3>
            <p className="text-mitti-dark-brown/80 leading-relaxed">
              Explore verified rural homestays offering genuine local
              experiences across India.
            </p>
          </div>

          <div>
            <Handshake className="text-mitti-brown mb-4" />
            <h3 className="text-xl font-semibold text-mitti-dark-brown mb-3">
              Empower
            </h3>
            <p className="text-mitti-dark-brown/80 leading-relaxed">
              Enable homestay owners to list and manage properties without
              technical barriers.
            </p>
          </div>

          <div>
            <ShieldCheck className="text-mitti-brown mb-4" />
            <h3 className="text-xl font-semibold text-mitti-dark-brown mb-3">
              Build Trust
            </h3>
            <p className="text-mitti-dark-brown/80 leading-relaxed">
              Create confidence through verification, transparent policies, and
              clear communication.
            </p>
          </div>
        </div>
      </section>

      {/* Rural First */}
      <section className="px-4 sm:px-6 pb-24 flex justify-center">
        <div className="max-w-6xl bg-mitti-cream rounded-2xl p-12">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="text-mitti-brown" />
            <h2 className="text-2xl font-semibold text-mitti-dark-brown">
              A Rural-First Approach
            </h2>
          </div>

          <p className="text-mitti-dark-brown/80 leading-relaxed max-w-4xl">
            MITTI is designed with an understanding of rural realities such as
            limited digital familiarity and inconsistent connectivity. The
            platform avoids unnecessary features and prioritizes usability.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 sm:px-6 pb-24 flex justify-center">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <Eye className="text-mitti-brown mb-3" />
            <h3 className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Transparency
            </h3>
            <p className="text-mitti-dark-brown/80">
              Honest information, clear policies, and visible expectations.
            </p>
          </div>

          <div>
            <Cpu className="text-mitti-brown mb-3" />
            <h3 className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Purposeful Technology
            </h3>
            <p className="text-mitti-dark-brown/80">
              Technology used as a support system, not a barrier.
            </p>
          </div>

          <div>
            <Heart className="text-mitti-brown mb-3" />
            <h3 className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Respect
            </h3>
            <p className="text-mitti-dark-brown/80">
              Deep respect for local communities, culture, and livelihoods.
            </p>
          </div>

          <div>
            <ShieldCheck className="text-mitti-brown mb-3" />
            <h3 className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Simplicity
            </h3>
            <p className="text-mitti-dark-brown/80">
              Clear flows and minimal friction instead of feature overload.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="px-4 sm:px-6 pb-28 flex justify-center">
        <div className="max-w-6xl text-center">
          <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-8">
            Explore more about MITTI
          </p>

          <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
            {[
              { href: "/about/who-we-are", label: "Who We Are" },
              { href: "/about/mission", label: "Mission" },
              { href: "/about/vision", label: "Vision" },
              { href: "/about/objectives", label: "Objectives" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
