"use client";

import { Input } from "@/components/ui/prebuilt-components/input";
import { Button } from "@/components/ui/prebuilt-components/button";

export type ListingsFilters = {
  search: string;
  status: string;
};

export default function ListingsFilterBar({
  filters,
  onChange,
  onClear,
}: {
  filters: ListingsFilters;
  onChange: (filters: ListingsFilters) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Search
        </label>
        <Input
          placeholder="Name or location"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-64 border border-mitti-khaki bg-white"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Status
        </label>
        <select
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <Button
        variant="outline"
        onClick={onClear}
        className="ml-auto cursor-pointer"
      >
        Clear filters
      </Button>
    </div>
  );
}
