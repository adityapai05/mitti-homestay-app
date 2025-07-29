"use client";
import SidebarFilters from "@/components/ui/explorepage/ExploreSidebar";
import HomestayCard from "@/components/shared/HomestayCard";
import SearchBar from "@/components/ui/homepage/search-bar/SearchBar";

export default function ExplorePage() {
  return (
    <div className="flex  flex-col gap-5">
      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <aside className="w-full">
          <SidebarFilters />
        </aside>

        <section className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <HomestayCard
              title="lol"
              description="lol"
              imageSrc="/mitti-logo.png"
              price={100}
              rating={5}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
