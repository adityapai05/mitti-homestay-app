"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/prebuilt-components/button";
import { ArrowUpDown, Eye } from "lucide-react";
import type { AdminAuditLog } from "../_types/admin-audit-log";

export const auditLogColumns = (
  onView: (log: AdminAuditLog) => void
): ColumnDef<AdminAuditLog>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 h-auto"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString("en-IN"),
  },
  {
    accessorKey: "admin.name",
    header: "Admin",
    cell: ({ row }) => row.original.admin.name,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="font-medium text-mitti-dark-brown">
        {row.original.action.replaceAll("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "entity",
    header: "Entity",
  },
  {
    accessorKey: "entityId",
    header: "Entity ID",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-mitti-dark-brown/70">
        {row.original.entityId.slice(0, 8)}…
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Meta</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <button
          onClick={() => onView(row.original)}
          className="inline-flex items-center gap-1 text-mitti-olive hover:underline cursor-pointer text-sm"
        >
          View
          <Eye size={14} />
        </button>
      </div>
    ),
  },
];
