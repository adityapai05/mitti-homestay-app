"use client";

import { useState } from "react";
import ContactMessagesTable from "./ContactMessagesTable";
import Pagination from "./Pagination";

type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ContactMessagesClient({
  messages,
  page,
  total,
  pageSize,
}: {
  messages: AdminContactMessage[];
  page: number;
  total: number;
  pageSize: number;
}) {
  const [selected, setSelected] = useState<AdminContactMessage | null>(null);

  return (
    <>
      <ContactMessagesTable
        messages={messages}
        selected={selected}
        onSelect={setSelected}
      />

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        basePath="/admin/contact"
      />
    </>
  );
}
