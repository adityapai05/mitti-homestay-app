"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListingsFilterBar, { ListingsFilters } from "./ListingsFilterBar";
import { ListingsDataTable } from "./ListingsDataTable";
import { listingColumns } from "./listing-columns";
import ListingReviewModal, { AdminListing } from "./ListingReviewModal";

/* ---------- Table view type ---------- */

type AdminListingRow = Omit<AdminListing, "pricePerNight"> & {
  pricePerNight: number;
};

/* ---------- Component ---------- */

export default function ListingsClient({
  listings,
  initialSearch,
  initialStatus,
}: {
  listings: AdminListing[];
  initialSearch: string;
  initialStatus: string;
}) {
  const router = useRouter();

  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(
    null
  );

  const [filters, setFilters] = useState<ListingsFilters>({
    search: initialSearch,
    status: initialStatus,
  });

  /* ---------- Persist filters in URL ---------- */
  useEffect(() => {
    const sp = new URLSearchParams();

    if (filters.search) sp.set("search", filters.search);
    if (filters.status) sp.set("status", filters.status);

    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [filters, router]);

  /* ---------- Filtering + table adapter ---------- */
  const filteredListings = useMemo<AdminListingRow[]>(() => {
    return listings
      .filter((l) => {
        // Search
        if (filters.search) {
          const s = filters.search.toLowerCase();
          const location = `${l.village ?? ""} ${l.district ?? ""} ${
            l.state ?? ""
          }`.toLowerCase();

          if (!l.name.toLowerCase().includes(s) && !location.includes(s)) {
            return false;
          }
        }

        // Status
        if (filters.status) {
          if (filters.status === "VERIFIED" && !l.isVerified) return false;
          if (
            filters.status === "PENDING" &&
            (l.isVerified || l.rejectionReason)
          )
            return false;
          if (filters.status === "REJECTED" && !l.rejectionReason) return false;
        }

        return true;
      })
      .map((l) => ({
        ...l,
        pricePerNight: Number(l.pricePerNight),
      }));
  }, [listings, filters]);

  return (
    <>
      <ListingsFilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() =>
          setFilters({
            search: "",
            status: "",
          })
        }
      />

      <ListingsDataTable
        data={filteredListings}
        columns={listingColumns((row) => {
          const full = listings.find((l) => l.id === row.id);
          if (full) setSelectedListing(full);
        })}
      />

      {selectedListing && (
        <ListingReviewModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  );
}
