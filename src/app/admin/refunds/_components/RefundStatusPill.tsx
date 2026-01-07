import type { RefundStatus } from "@prisma/client";

export default function RefundStatusPill({ status }: { status: RefundStatus }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSED: "bg-green-100 text-green-800",
    NOT_APPLICABLE: "bg-gray-100 text-gray-600",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
