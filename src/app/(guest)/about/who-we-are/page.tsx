import Link from "next/link";

export default function WhoWeArePage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Who We Are
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Built with intention, grounded in context
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-10 text-mitti-dark-brown/80 leading-relaxed">
            <p className="text-lg">
              MITTI is a student-built platform created as part of the Bachelor
              of Science in Information Technology program. It was developed
              with a strong focus on applying software engineering principles to
              a real-world problem rooted in social and regional context.
            </p>

            <p className="text-lg">
              The project is guided by academic learning, technical exploration,
              and a clear intent to design responsibly. Instead of replicating
              large commercial platforms, MITTI focuses on simplicity,
              transparency, and usability for users who may not be digitally
              fluent.
            </p>

            <p className="text-lg">
              MITTI is built for two primary groups. Rural homestay owners who
              want a simple way to list and manage their properties, and
              travellers who seek authentic stays beyond urban and commercial
              tourism experiences.
            </p>

            <p className="text-lg">
              This platform does not aim to disrupt existing systems or replace
              established marketplaces. It is designed as a focused solution
              that demonstrates how technology can support rural tourism in an
              ethical and practical manner.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-10 pt-5 border-t border-mitti-dark-brown/20 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-dark-brown/60 mb-6">
              Continue exploring
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium text-mitti-brown">
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
              <Link
                href="/about/objectives"
                className="transition-all duration-200 hover:text-mitti-dark-brown hover:-translate-y-[1px]"
              >
                Objectives
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
