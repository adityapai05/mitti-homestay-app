import { prisma } from "@/lib/prisma";
import UsersClient from "./_components/UsersClient";
import { Role, HostVerificationStatus } from "@prisma/client";

type AdminUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;

  role: Role;
  isActive: boolean;

  createdAt: string;

  homestays: { id: string }[];

  hostProfile?: {
    verificationStatus?: HostVerificationStatus | null;
  } | null;
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      hostProfile: true,
      homestays: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  /* ---------- Prisma → Admin DTO ---------- */
  const adminUsers: AdminUser[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,

    role: u.role,
    isActive: u.isActive,

    createdAt: u.createdAt.toISOString(),

    homestays: u.homestays,

    hostProfile: u.hostProfile
      ? {
          verificationStatus: u.hostProfile.verificationStatus,
        }
      : null,
  }));

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">Users</h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Manage and review platform users
        </p>
      </div>

      <UsersClient users={adminUsers} />
    </div>
  );
}
