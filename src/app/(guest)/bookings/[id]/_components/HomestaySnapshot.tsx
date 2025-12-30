import Image from "next/image";
import Link from "next/link";

interface HomestaySnapshotProps {
  homestay: {
    id: string;
    name: string;
    imageUrl: string[];
    village?: string | null;
    district?: string | null;
    state?: string | null;
    pincode?: string | null;
  };
}

export default function HomestaySnapshot({ homestay }: HomestaySnapshotProps) {
  const { id, name, imageUrl, village, district, state, pincode } = homestay;
  const coverImage = imageUrl?.[0] ?? null;
  const location = [village, district, state, pincode].filter(Boolean).join(", ");

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-4 shadow-sm">
      <div className="flex gap-4 items-start">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-mitti-beige">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/homestays/${id}`}
            target="_blank"
            className="block text-base font-semibold text-mitti-dark-brown hover:text-mitti-brown"
          >
            {name}
          </Link>

          {location ? (
            <p className="mt-1 text-sm text-mitti-dark-brown/60 truncate">
              {location}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
