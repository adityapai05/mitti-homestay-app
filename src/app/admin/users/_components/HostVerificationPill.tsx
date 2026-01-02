export default function HostVerificationPill({
  role,
  status,
}: {
  role: string;
  status?: string | null;
}) {
  if (role !== "HOST") {
    return <span className="text-mitti-dark-brown/40">—</span>;
  }

  if (status === "VERIFIED") {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-mitti-olive/20 text-mitti-olive">
        Verified
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
      Pending
    </span>
  );
}
