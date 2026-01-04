"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UsersFilterBar, { UsersFilters } from "./UsersFilterBar";
import { UsersDataTable } from "./UsersDataTable";
import { userColumns } from "./user-columns";
import UserReviewModal from "./UserReviewModal";
import { Role, HostVerificationStatus } from "@prisma/client";

/* ---------- Local structural twin ---------- */
type HomestayStub = {
  id: string;
};

/* ---------- Canonical AdminUser (matches table EXACTLY) ---------- */
type AdminUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;

  role: Role;
  isActive: boolean;

  createdAt: string;

  homestays: HomestayStub[];

  hostProfile?: {
    verificationStatus?: HostVerificationStatus | null;
  } | null;
};

/* ---------- Component ---------- */

export default function UsersClient({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [filters, setFilters] = useState<UsersFilters>({
    search: "",
    role: "",
    status: "",
    hostVerification: "",
  });

  /* 1. Read filters from URL */
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") ?? "",
      role: searchParams.get("role") ?? "",
      status: searchParams.get("status") ?? "",
      hostVerification: searchParams.get("hostVerification") ?? "",
    });
  }, [searchParams]);

  /* 2. Write filters to URL */
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);
    if (filters.status) params.set("status", filters.status);
    if (filters.hostVerification) {
      params.set("hostVerification", filters.hostVerification);
    }

    router.replace(`/admin/users?${params.toString()}`, {
      scroll: false,
    });
  }, [filters, router]);

  /* 3. Apply filters locally */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = filters.search.toLowerCase();

      if (
        search &&
        !(
          user.name.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone?.includes(search)
        )
      ) {
        return false;
      }

      if (filters.role && user.role !== filters.role) return false;

      if (filters.status) {
        const active = filters.status === "ACTIVE";
        if (user.isActive !== active) return false;
      }

      if (filters.hostVerification) {
        const status = user.hostProfile?.verificationStatus ?? "NONE";
        if (status !== filters.hostVerification) return false;
      }

      return true;
    });
  }, [users, filters]);

  return (
    <>
      <UsersFilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() =>
          setFilters({
            search: "",
            role: "",
            status: "",
            hostVerification: "",
          })
        }
      />

      <UsersDataTable
        data={filteredUsers}
        columns={userColumns((user) => {
          setSelectedUser(user);
        })}
      />

      {selectedUser && (
        <UserReviewModal
          user={{
            ...selectedUser,
            hostProfile: selectedUser.hostProfile
              ? {
                  verificationStatus:
                    selectedUser.hostProfile.verificationStatus ?? null,
                }
              : null,
          }}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
