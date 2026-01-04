"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/prebuilt-components/button";

export type AdminListing = {
  id: string;
  name: string;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  pricePerNight: number;
  isVerified: boolean;
  rejectionReason?: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string;
  };
};

export const listingColumns = (
  onReview: (listing: AdminListing) => void
): ColumnDef<AdminListing>[] => [
  {
    accessorKey: "name",
    header: "Listing",
    cell: ({ row }) => {
      const l = row.original;
      return (
        <div>
          <p className="font-medium text-mitti-dark-brown">{l.name}</p>
          <p className="text-xs text-mitti-dark-brown/70">
            {[l.village, l.district, l.state].filter(Boolean).join(", ")}
          </p>
        </div>
      );
    },
  },

  {
    id: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 h-auto"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const l = row.original;
      if (l.isVerified) return "Verified";
      if (l.rejectionReason) return "Rejected";
      return "Pending";
    },
    sortingFn: (a, b) => {
      const rank = (l: AdminListing) =>
        l.isVerified ? 2 : l.rejectionReason ? 0 : 1;

      return rank(a.original) - rank(b.original);
    },
  },

  {
    accessorKey: "pricePerNight",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 h-auto"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `₹${row.original.pricePerNight}`,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 h-auto"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },

  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <button
          onClick={() => onReview(row.original)}
          className="inline-flex items-center gap-1 text-mitti-olive hover:underline cursor-pointer text-sm"
        >
          Review
          <ChevronRight size={14} />
        </button>
      </div>
    ),
  },
];
