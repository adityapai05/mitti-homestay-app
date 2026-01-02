import Link from "next/link";

export default function HostAccountabilitySection({
  homestay,
}: {
  homestay: any;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-mitti-dark-brown">
        Host Accountability
      </h2>

      <Link
        href={`/profile/${homestay.owner.id}`}
        target="_blank"
        className="inline-block text-sm font-medium text-mitti-olive hover:underline"
      >
        View host profile in new tab
      </Link>
    </section>
  );
}
