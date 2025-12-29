import ExplorePageContent from "@/components/ui/explorepage/ExplorePageContent";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center" role="alert" aria-live="polite">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-mitti-khaki rounded-full" />
            <div className="h-6 bg-mitti-cream rounded w-3/4 mx-auto" />
            <div className="h-4 bg-mitti-beige rounded w-1/2 mx-auto" />
          </div>
          <p className="mt-4 text-mitti-muted">Loading your rural escapes...</p>
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}
