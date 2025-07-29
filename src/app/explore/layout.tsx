import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Homestays | Mitti",
  description: "Browse unique rural homestays across India.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-mitti-beige text-mitti-dark-brown">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
