import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Role } from "@/types";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.ADMIN) {
    notFound();
  }

  return (
    <div className="h-screen bg-mitti-beige flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader admin={user} />

        {/* Scrollable content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
