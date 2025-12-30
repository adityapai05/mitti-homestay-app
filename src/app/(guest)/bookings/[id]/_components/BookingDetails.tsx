import { format } from "date-fns";
import Link from "next/link";

interface BookingDetailsProps {
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  guideAvailable: boolean;
  host: {
    name: string;
    phone: string | null;
    email: string | null;
  };
}

export default function BookingDetails({
  checkIn,
  checkOut,
  nights,
  guests,
  guideAvailable,
  host,
}: BookingDetailsProps) {
  const formattedCheckIn = format(checkIn, "EEE, dd MMM yyyy");
  const formattedCheckOut = format(checkOut, "EEE, dd MMM yyyy");

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Your booking
      </h2>

      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-mitti-dark-brown/60">Check in</p>
          <p className="font-medium text-mitti-dark-brown">
            {formattedCheckIn}
          </p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Check out</p>
          <p className="font-medium text-mitti-dark-brown">
            {formattedCheckOut}
          </p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Nights</p>
          <p className="font-medium text-mitti-dark-brown">{nights}</p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Guests</p>
          <p className="font-medium text-mitti-dark-brown">{guests}</p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Local guide</p>
          <p className="font-medium text-mitti-dark-brown">
            {guideAvailable ? "Included" : "Not included"}
          </p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Host contact</p>
          <p className="font-medium text-mitti-dark-brown">
            {host.name}
            <Link href={`tel:${host.phone ? host.phone : ""} `}>
              {host.phone ? ` • ${host.phone}` : ""}
            </Link>
            <Link href={`mailto:${host.email ? host.email : ""} `}>
              {" • "} {host.email}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
