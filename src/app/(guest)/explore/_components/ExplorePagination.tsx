"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/prebuilt-components/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useExploreNavigation } from "@/hooks/useExploreNavigation";
import { useExploreData } from "@/hooks/useExploreData";
import { useExploreQuery } from "@/hooks/useExploreQuery";

const PAGE_WINDOW = 5;

export default function ExplorePagination() {
  const { totalPages } = useExploreData();
  const { page } = useExploreQuery();
  const { updateQuery } = useExploreNavigation();

  if (!totalPages || totalPages <= 1) return null;

  function goToPage(target: number) {
    if (target < 1 || target > totalPages) return;
    updateQuery({ page: target });
  }

  const half = Math.floor(PAGE_WINDOW / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < PAGE_WINDOW) {
    if (start === 1) {
      end = Math.min(totalPages, start + PAGE_WINDOW - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - PAGE_WINDOW + 1);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Pagination className="mt-6 sm:mt-8">
      <PaginationContent className="flex items-center justify-center gap-2">
        {/* Previous */}
        <PaginationItem>
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className={`
              flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium
              transition-all
              ${
                page === 1
                  ? "cursor-not-allowed text-mitti-dark-brown/30"
                  : "text-mitti-dark-brown hover:bg-mitti-cream"
              }
            `}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
        </PaginationItem>

        {/* First page */}
        {start > 1 && (
          <>
            <PaginationItem>
              <button
                onClick={() => goToPage(1)}
                className="h-9 w-9 rounded-full text-sm font-medium text-mitti-dark-brown hover:bg-mitti-cream transition-all"
              >
                1
              </button>
            </PaginationItem>
            <span className="px-1 text-mitti-dark-brown/40">…</span>
          </>
        )}

        {/* Page window */}
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm border border-mitti-khaki">
          {pages.map((current) => {
            const isActive = current === page;

            return (
              <PaginationItem key={current}>
                <button
                  onClick={() => goToPage(current)}
                  className={`
                    h-9 w-9 rounded-full text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-mitti-dark-brown text-mitti-cream shadow"
                        : "text-mitti-dark-brown hover:bg-mitti-cream"
                    }
                  `}
                >
                  {current}
                </button>
              </PaginationItem>
            );
          })}
        </div>

        {/* Last page */}
        {end < totalPages && (
          <>
            <span className="px-1 text-mitti-dark-brown/40">…</span>
            <PaginationItem>
              <button
                onClick={() => goToPage(totalPages)}
                className="h-9 w-9 rounded-full text-sm font-medium text-mitti-dark-brown hover:bg-mitti-cream transition-all"
              >
                {totalPages}
              </button>
            </PaginationItem>
          </>
        )}

        {/* Next */}
        <PaginationItem>
          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className={`
              flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium
              transition-all
              ${
                page === totalPages
                  ? "cursor-not-allowed text-mitti-dark-brown/30"
                  : "text-mitti-dark-brown hover:bg-mitti-cream"
              }
            `}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
