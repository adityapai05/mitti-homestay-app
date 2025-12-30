import Image from "next/image";

export default function GuestSnapshot({
  guest,
}: {
  guest: {
    name: string;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
}) {
  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5">
      <h3 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Guest details
      </h3>

      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-mitti-beige">
          {guest.image && (
            <Image
              src={guest.image}
              alt={guest.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div>
          <p className="font-medium text-mitti-dark-brown">{guest.name}</p>
          {guest.email && (
            <p className="text-sm text-mitti-dark-brown/70">{guest.email}</p>
          )}
          {guest.phone && (
            <p className="text-sm text-mitti-dark-brown/70">{guest.phone}</p>
          )}
        </div>
      </div>
    </section>
  );
}
