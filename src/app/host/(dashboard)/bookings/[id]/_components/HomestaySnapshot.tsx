import Image from "next/image";
import Link from "next/link";

export default function HomestaySnapshot({
  homestay,
}: {
  homestay: {
    id: string;
    name: string;
    imageUrl: string[];
    displayAddress: string;
  };
}) {
  const cover = homestay.imageUrl?.[0] ?? "/mitti-placeholder.jpg";

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5">
      <h3 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Homestay
      </h3>

      <Link
        href={`/host/homestays/${homestay.id}`}
        className="flex gap-4 hover:bg-mitti-beige/40 p-2 rounded-lg transition cursor-pointer"
      >
        <div className="relative h-20 w-28 rounded-lg overflow-hidden">
          <Image
            src={cover}
            alt={homestay.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-medium text-mitti-dark-brown">{homestay.name}</p>
          <p className="text-sm text-mitti-dark-brown/70">
            {homestay.displayAddress}
          </p>
        </div>
      </Link>
    </section>
  );
}
