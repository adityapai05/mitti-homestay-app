export default function PayoutStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}
