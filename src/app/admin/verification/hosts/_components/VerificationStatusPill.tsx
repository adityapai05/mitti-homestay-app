export default function VerificationStatusPill({
  status,
}: {
  status: "PENDING" | "VERIFIED" | "REJECTED";
}) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
