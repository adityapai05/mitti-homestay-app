"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import SidebarFilters from "@/components/ui/explorepage/ExploreSidebar";
import ExploreSearch from "@/components/ui/explorepage/ExploreSearch";
import HomestaysGrid from "@/components/ui/explorepage/HomestayGrid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/prebuilt-components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/prebuilt-components/select";
import { Homestay } from "@/types";

export default function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(
    searchParams.get("sort") || "createdAt-desc"
  );

  const fetchHomestays = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      params.set("sort", sort);

      const response = await axios.get(`/api/homestays?${params.toString()}`);
      setHomestays(response.data.homestays || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching homestays:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, searchParams]);

  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const currentParams = qs.parse(searchParams.toString());
    const newQuery = { ...currentParams, page, sort };
    const query = qs.stringifyUrl({ url: "/explore", query: newQuery }, { arrayFormat: "bracket" });
    router.push(query);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setCurrentPage(1);
    const currentParams = qs.parse(searchParams.toString());
    const newQuery = { ...currentParams, sort: value, page: 1 };
    const query = qs.stringifyUrl({ url: "/explore", query: newQuery }, { arrayFormat: "bracket" });
    router.push(query);
  };

  return (
    <div className="flex flex-col gap-6">
      <ExploreSearch />

      <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8 md:grid md:grid-cols-[280px_1fr] gap-10">
        <aside className="w-full">
          <SidebarFilters />
        </aside>

        <div className="w-full flex flex-col gap-6 mt-2 md:mt-0">
          {/* Sort Dropdown */}
          <div className="flex justify-end">
            <Select onValueChange={handleSortChange} value={sort}>
              <SelectTrigger
                className="w-full md:w-[200px] bg-mitti-dark-brown text-mitti-beige border-mitti-cream rounded-md shadow-md focus:ring-mitti-olive focus:border-mitti-olive"
                aria-label="Sort homestays"
              >
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-mitti-brown text-mitti-beige border-mitti-cream rounded-md shadow-lg">
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="price-asc">Cost: Low to High</SelectItem>
                <SelectItem value="price-desc">Cost: High to Low</SelectItem>
                <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Homestays grid */}
          <div className="min-h-[800px] md:min-h-[700px]">
            <HomestaysGrid homestays={homestays} loading={loading} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="bg-mitti-brown text-mitti-beige rounded-lg p-2 flex justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    size="default"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={`${currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-mitti-khaki"} text-mitti-beige rounded-md px-3 py-1`}
                    aria-label="Go to previous page"
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        size="default"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={page === currentPage}
                        className={`${page === currentPage
                            ? "bg-mitti-dark-brown text-mitti-cream"
                            : "hover:bg-mitti-khaki text-mitti-beige"} rounded-md px-3 py-1`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    size="default"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={`${currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-mitti-khaki"} text-mitti-beige rounded-md px-3 py-1`}
                    aria-label="Go to next page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
