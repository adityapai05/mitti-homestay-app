export default function StayDetails({
  booking,
}: {
  booking: {
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
  };
}) {
  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5">
      <h3 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Stay details
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-mitti-dark-brown/60">Check-in</p>
          <p className="font-medium text-mitti-dark-brown">
            {new Date(booking.checkIn).toDateString()}
          </p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Check-out</p>
          <p className="font-medium text-mitti-dark-brown">
            {new Date(booking.checkOut).toDateString()}
          </p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Nights</p>
          <p className="font-medium text-mitti-dark-brown">{booking.nights}</p>
        </div>

        <div>
          <p className="text-mitti-dark-brown/60">Guests</p>
          <p className="font-medium text-mitti-dark-brown">{booking.guests}</p>
        </div>
      </div>
    </section>
  );
}
