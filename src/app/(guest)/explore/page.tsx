import ExploreShell from "./_components/ExploreShell";
import ExploreSearchBar from "./_components/ExploreSearchBar";
import ExploreFilters from "./_components/ExploreFilters";
import ExploreSort from "./_components/ExploreSort";
import ExploreGrid from "./_components/ExploreGrid";
import ExplorePagination from "./_components/ExplorePagination";
import { Suspense } from "react";
import ExploreSkeleton from "./_components/ExploreSkeleton";

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreShell>
        <ExploreSearchBar />
        <div className="flex items-center justify-between gap-4">
          <ExploreFilters />
          <ExploreSort />
        </div>

        <ExploreGrid />
        <ExplorePagination />
      </ExploreShell>
    </Suspense>
  );
}
