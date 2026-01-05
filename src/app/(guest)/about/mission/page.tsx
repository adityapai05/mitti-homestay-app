import Link from "next/link";

export default function MissionPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Our Mission
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Making rural tourism
              <br /> accessible, ethical, and simple
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-10 text-mitti-dark-brown/80 leading-relaxed">
            <p className="text-lg">
              MITTI’s mission is to enable meaningful connections between
              travellers and rural communities through authentic homestay
              experiences.
            </p>

            <p className="text-lg">
              The platform is designed to reduce technical barriers for rural
              homestay owners by providing tools that are simple to understand,
              easy to manage, and practical to use without advanced digital
              skills.
            </p>

            <p className="text-lg">
              For travellers, MITTI aims to offer verified listings, transparent
              information, and clear expectations, helping them explore
              destinations beyond urban and commercial tourism.
            </p>

            <p className="text-lg">
              Above all, MITTI seeks to demonstrate how technology can be used
              responsibly to support rural livelihoods, preserve local culture,
              and encourage sustainable tourism practices.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-10 pt-5 border-t border-mitti-dark-brown/20 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
              <Link
                href="/about/vision"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Vision
              </Link>
              <Link
                href="/about/objectives"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Objectives
              </Link>
              <Link
                href="/about/who-we-are"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Who We Are
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
