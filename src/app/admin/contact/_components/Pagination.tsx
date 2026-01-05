import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  total,
  pageSize,
  basePath,
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
}) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <div className="mt-10 flex items-center justify-between rounded-xl border border-mitti-khaki bg-mitti-cream px-4 py-3">
      {/* Page info */}
      <p className="text-sm text-mitti-dark-brown/70">
        Page <span className="font-medium text-mitti-dark-brown">{page}</span>{" "}
        of{" "}
        <span className="font-medium text-mitti-dark-brown">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {prevPage ? (
          <Link
            href={`${basePath}?page=${prevPage}`}
            className="flex items-center gap-1 rounded-md border border-mitti-khaki px-3 py-1.5 text-sm text-mitti-dark-brown transition hover:bg-mitti-beige"
          >
            <ChevronLeft size={16} />
            Previous
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-1 rounded-md border border-mitti-khaki px-3 py-1.5 text-sm text-mitti-dark-brown/40">
            <ChevronLeft size={16} />
            Previous
          </span>
        )}

        {nextPage ? (
          <Link
            href={`${basePath}?page=${nextPage}`}
            className="flex items-center gap-1 rounded-md border border-mitti-khaki px-3 py-1.5 text-sm text-mitti-dark-brown transition hover:bg-mitti-beige"
          >
            Next
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-1 rounded-md border border-mitti-khaki px-3 py-1.5 text-sm text-mitti-dark-brown/40">
            Next
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
