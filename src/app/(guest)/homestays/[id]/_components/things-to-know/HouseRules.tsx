import { Key } from "lucide-react";

export default function HouseRules({
  checkIn,
  checkOut,
  maxGuests,
}: {
  checkIn: string;
  checkOut: string;
  maxGuests: number;
}) {
  return (
    <div className="space-y-2 text-sm text-mitti-dark-brown/80">
      <Key className="h-5 w-5 text-mitti-olive" />

      <h3 className="font-medium text-mitti-dark-brown">House Rules</h3>

      <ul className="space-y-1">
        <li>Check-in after {checkIn}</li>
        <li>Check-out before {checkOut}</li>
        <li>{maxGuests} {maxGuests === 1 ? "guest" : "guests"} maximum</li>
      </ul>
    </div>
  );
}
