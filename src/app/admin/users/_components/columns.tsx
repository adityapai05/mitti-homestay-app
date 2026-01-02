"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/prebuilt-components/button";
import RolePill from "./RolePill";
import StatusPill from "./StatusPill";
import HostVerificationPill from "./HostVerificationPill";

export type AdminUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: "USER" | "HOST" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  homestays: any[];
  hostProfile?: {
    verificationStatus?: string | null;
  } | null;
};

export const userColumns = (
  onReview: (user: AdminUser) => void
): ColumnDef<AdminUser>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <p className="font-medium text-mitti-dark-brown">{user.name}</p>
          <p className="text-xs text-mitti-dark-brown/70">
            {user.email || user.phone}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto text-left font-medium text-mitti-dark-brown"
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <RolePill role={row.original.role} />,
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <StatusPill active={row.original.isActive} />,
  },

  {
    id: "hostVerification",
    header: "Host verification",
    cell: ({ row }) => (
      <HostVerificationPill
        role={row.original.role}
        status={row.original.hostProfile?.verificationStatus}
      />
    ),
    sortingFn: (a, b) => {
      const aStatus = a.original.hostProfile?.verificationStatus ?? "";
      const bStatus = b.original.hostProfile?.verificationStatus ?? "";
      return aStatus.localeCompare(bStatus);
    },
  },

  {
    id: "listings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto text-left font-medium text-mitti-dark-brown"
      >
        Listings
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.homestays.length,
    sortingFn: (a, b) =>
      a.original.homestays.length - b.original.homestays.length,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto text-left font-medium text-mitti-dark-brown"
      >
        Joined
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
