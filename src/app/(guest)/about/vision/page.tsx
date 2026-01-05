import Link from "next/link";

export default function VisionPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Our Vision
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              A trusted bridge <br /> between travellers and rural India
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-10 text-mitti-dark-brown/80 leading-relaxed">
            <p className="text-lg">
              MITTI envisions a future where rural homestays across India are
              visible, accessible, and valued as an integral part of the tourism
              ecosystem.
            </p>

            <p className="text-lg">
              The platform aims to support a form of tourism that respects local
              culture, traditions, and livelihoods, while allowing travellers to
              experience destinations beyond conventional urban travel.
            </p>

            <p className="text-lg">
              MITTI seeks to encourage responsible travel practices by promoting
              transparency, verified listings, and clear communication between
              hosts and guests.
            </p>

            <p className="text-lg">
              In the long term, the vision is to demonstrate how thoughtfully
              designed technology can contribute to sustainable rural tourism
              without compromising authenticity or community values.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-10 pt-5 border-t border-mitti-dark-brown/20 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
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
              <Link
                href="/about/mission"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
