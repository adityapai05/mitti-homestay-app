export default function HomestayStatusPill({
  verified,
}: {
  verified: boolean;
}) {
  if (verified) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        VERIFIED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
      PENDING
    </span>
  );
}
