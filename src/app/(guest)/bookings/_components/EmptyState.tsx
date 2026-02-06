import Link from "next/link";
import { Home } from "lucide-react";

export default function EmptyState({ type }: { type: "upcoming" | "past" }) {
  return (
    <div className="rounded-xl border border-mitti-khaki bg-white p-10 text-center space-y-5">
      {/* Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mitti-olive/10">
        <Home className="h-6 w-6 text-mitti-olive" strokeWidth={1.6} />
      </div>

      <h3 className="text-lg font-medium text-mitti-dark-brown">
        {type === "upcoming"
          ? "You have no upcoming stays"
          : "No past stays yet"}
      </h3>

      <p className="text-sm text-mitti-dark-brown/60 max-w-md mx-auto">
        Discover authentic village homes and connect with local hosts across
        rural India.
      </p>

      <Link
        href="/explore"
        className="inline-block rounded-lg bg-mitti-brown px-5 py-2.5 text-sm font-medium text-white hover:bg-mitti-brown/90 cursor-pointer"
      >
        Explore homestays
      </Link>
    </div>
  );
}
