import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await getCurrentUser();
  
    if (!user || user.role !== Role.HOST) {
      notFound();
    }
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mitti-beige">
      {children}
    </div>
  );
}
