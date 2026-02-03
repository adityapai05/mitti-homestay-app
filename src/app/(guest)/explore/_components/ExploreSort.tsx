"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/prebuilt-components/select";
import { useExploreQuery } from "@/hooks/useExploreQuery";
import { useExploreNavigation } from "@/hooks/useExploreNavigation";

export default function ExploreSort() {
  const { sort } = useExploreQuery();
  const { updateQuery } = useExploreNavigation();

  return (
    <div className="flex justify-end">
      <Select
        value={sort}
        onValueChange={(value) => {
          updateQuery({
            sort: value,
            page: 1,
          });
        }}
      >
        <SelectTrigger
          aria-label="Sort homestays"
          className="w-full sm:w-[220px]
            flex items-center justify-between
            px-4 py-2.5
            rounded-full
            border border-mitti-khaki
            bg-white
            text-sm font-medium text-mitti-dark-brown
            shadow-sm
            hover:border-mitti-brown hover:shadow-md
            transition-all
            active:scale-95
            focus:ring-2 focus:ring-mitti-brown focus:ring-offset-0"
        >
          <SelectValue placeholder="Sort" />
        </SelectTrigger>

        <SelectContent className="bg-white border border-mitti-khaki text-mitti-dark-brown shadow-lg rounded-xl">
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
