import { prisma } from "@/lib/prisma";
import ContactMessagesClient from "./_components/ContactMessagesClient";

const PAGE_SIZE = 5;

type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? "1");

  const skip = (page - 1) * PAGE_SIZE;

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count(),
  ]);

  const adminMessages: AdminContactMessage[] = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    isRead: m.isRead,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Contact Messages
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Messages submitted through the contact form
        </p>
      </div>

      <ContactMessagesClient
        messages={adminMessages}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
