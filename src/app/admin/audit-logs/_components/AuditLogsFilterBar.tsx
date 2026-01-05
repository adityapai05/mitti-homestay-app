"use client";

import { Button } from "@/components/ui/prebuilt-components/button";

export type AuditLogsFilters = {
  action: string;
  entity: string;
  fromDate?: string;
  toDate?: string;
};

export default function AuditLogsFilterBar({
  filters,
  onChange,
}: {
  filters: AuditLogsFilters;
  onChange: (filters: AuditLogsFilters) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Action
        </label>
        <select
          value={filters.action}
          onChange={(e) => onChange({ ...filters, action: e.target.value })}
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer w-56"
        >
          <option value="">All actions</option>
          <option value="HOST_APPROVED">Host approved</option>
          <option value="HOST_REJECTED">Host rejected</option>
          <option value="APPROVE_HOMESTAY">Homestay approved</option>
          <option value="REJECT_HOMESTAY">Homestay rejected</option>
          <option value="PAYOUT_PROCESSED">Payout processed</option>
          <option value="PAYOUT_FAILED">Payout failed</option>
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Entity
        </label>
        <select
          value={filters.entity}
          onChange={(e) => onChange({ ...filters, entity: e.target.value })}
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer w-48"
        >
          <option value="">All entities</option>
          <option value="HOST">Host</option>
          <option value="HOMESTAY">Homestay</option>
          <option value="USER">User</option>
          <option value="PAYOUT">Payout</option>
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          From
        </label>
        <input
          type="date"
          value={filters.fromDate ?? ""}
          onChange={(e) => onChange({ ...filters, fromDate: e.target.value })}
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          To
        </label>
        <input
          type="date"
          value={filters.toDate ?? ""}
          onChange={(e) => onChange({ ...filters, toDate: e.target.value })}
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
        />
      </div>

      <Button
        variant="outline"
        onClick={() =>
          onChange({
            action: "",
            entity: "",
            fromDate: undefined,
            toDate: undefined,
          })
        }
        className="ml-auto cursor-pointer"
      >
        Clear filters
      </Button>
    </div>
  );
}
