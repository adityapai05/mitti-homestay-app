import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mitti-cream to-mitti-beige">
      <Loader2 className="size-14 animate-spin text-mitti-brown mb-4" />
      <h2 className="text-xl font-semibold text-mitti-dark-brown">
        Loading homestay
      </h2>
      <p className="text-mitti-muted mt-1">Preparing your perfect stay</p>
    </div>
  );
}
