import Link from "next/link";

export default function ObjectivesPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Objectives
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Clear goals guiding the platform
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-10 text-mitti-dark-brown/80 leading-relaxed">
            <p className="text-lg">
              To provide rural homestay owners with a simple and intuitive
              platform to list, manage, and showcase their properties without
              technical complexity.
            </p>

            <p className="text-lg">
              To help travellers discover authentic rural stays through verified
              listings, transparent information, and clearly defined policies.
            </p>

            <p className="text-lg">
              To promote ethical and responsible tourism practices that respect
              local communities, culture, and livelihoods.
            </p>

            <p className="text-lg">
              To apply software engineering principles in solving a real-world
              problem, demonstrating how technology can be designed with social
              awareness and practical impact.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-10 pt-5 border-t border-mitti-dark-brown/20 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
              <Link
                href="/about/who-we-are"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Who We Are
              </Link>
              <Link
                href="/about/mission"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Mission
              </Link>
              <Link
                href="/about/vision"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Vision
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
