import ExplorePageContent from "@/components/ui/explorepage/ExplorePageContent";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading explore page...</div>}
    >
      <ExplorePageContent />
    </Suspense>
  );
}
