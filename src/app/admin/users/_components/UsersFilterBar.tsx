"use client";

import { Input } from "@/components/ui/prebuilt-components/input";
import { Button } from "@/components/ui/prebuilt-components/button";

export type UsersFilters = {
  search: string;
  role: string;
  status: string;
  hostVerification: string;
};

export default function UsersFilterBar({
  filters,
  onChange,
  onClear,
}: {
  filters: UsersFilters;
  onChange: (filters: UsersFilters) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      {/* Search */}
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Search
        </label>
        <Input
          placeholder="Name, email or phone"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-64 border border-mitti-khaki bg-white"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Role
        </label>
        <select
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
          value={filters.role}
          onChange={(e) => onChange({ ...filters, role: e.target.value })}
        >
          <option value="">All</option>
          <option value="USER">User</option>
          <option value="HOST">Host</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Account status
        </label>
        <select
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Host verification */}
      <div>
        <label className="block text-xs mb-1 text-mitti-dark-brown/60">
          Host verification
        </label>
        <select
          className="border border-mitti-khaki rounded-lg px-3 py-2 bg-white text-sm cursor-pointer"
          value={filters.hostVerification}
          onChange={(e) =>
            onChange({ ...filters, hostVerification: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
          <option value="NONE">Not submitted</option>
        </select>
      </div>

      {/* Clear */}
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
