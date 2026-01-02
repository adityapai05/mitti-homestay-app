import { prisma } from "@/lib/prisma";
import UsersClient from "./_components/UsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      hostProfile: true,
      homestays: true,
      payouts: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">Users</h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Manage and review platform users
        </p>
      </div>

      <UsersClient users={users} />
    </div>
  );
}
