import { prisma } from "@/lib/prisma";
import AuditLogsClient from "./_components/AuditLogsClient";
import type { AdminAuditLog } from "./_types/admin-audit-log";
import { prismaJsonToJsonValue } from "@/lib/json";

type SearchParams = {
  action?: string;
  entity?: string;
};

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const logs = await prisma.adminActionLog.findMany({
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const adminLogs: AdminAuditLog[] = logs.map((l) => ({
    id: l.id,
    adminId: l.adminId,
    action: l.action,
    entity: l.entity,
    entityId: l.entityId,
    meta: prismaJsonToJsonValue(l.meta),
    createdAt: l.createdAt.toISOString(),
    admin: {
      id: l.admin.id,
      name: l.admin.name,
      email: l.admin.email ?? null,
    },
  }));

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Audit Logs
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Read-only record of all admin actions on the platform
        </p>
      </div>

      <AuditLogsClient
        logs={adminLogs}
        initialAction={params?.action ?? ""}
        initialEntity={params?.entity ?? ""}
      />
    </div>
  );
}
