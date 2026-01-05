"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuditLogsFilterBar from "./AuditLogsFilterBar";
import { AuditLogsDataTable } from "./AuditLogsDataTable";
import { auditLogColumns } from "./audit-log-columns";
import AuditLogMetaModal from "./AuditLogMetaModal";
import type { AdminAuditLog } from "../_types/admin-audit-log";

type AuditLogsFilters = {
  action: string;
  entity: string;
  fromDate?: string;
  toDate?: string;
};

export default function AuditLogsClient({
  logs,
  initialAction,
  initialEntity,
}: {
  logs: AdminAuditLog[];
  initialAction: string;
  initialEntity: string;
}) {
  const [selected, setSelected] = useState<AdminAuditLog | null>(null);
  const router = useRouter();

  const [filters, setFilters] = useState<AuditLogsFilters>({
    action: initialAction,
    entity: initialEntity,
    fromDate: undefined,
    toDate: undefined,
  });

  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.action) sp.set("action", filters.action);
    if (filters.entity) sp.set("entity", filters.entity);
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [filters, router]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (filters.action && l.action !== filters.action) return false;
      if (filters.entity && l.entity !== filters.entity) return false;

      if (filters.fromDate) {
        if (new Date(l.createdAt) < new Date(filters.fromDate)) return false;
      }

      if (filters.toDate) {
        const end = new Date(filters.toDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(l.createdAt) > end) return false;
      }

      return true;
    });
  }, [logs, filters]);

  return (
    <>
      <AuditLogsFilterBar filters={filters} onChange={setFilters} />

      <AuditLogsDataTable
        data={filteredLogs}
        columns={auditLogColumns((row) => setSelected(row))}
      />

      {selected && (
        <AuditLogMetaModal log={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
