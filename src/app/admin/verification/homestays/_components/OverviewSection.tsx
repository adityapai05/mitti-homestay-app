import { Home, Users, IndianRupee, MapPin } from "lucide-react";

export default function OverviewSection({ homestay }: { homestay: any }) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-mitti-dark-brown">Overview</h2>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <Item icon={MapPin} label="Location" value={homestay.village || "—"} />
        <Item
          icon={IndianRupee}
          label="Price per night"
          value={`₹ ${homestay.pricePerNight}`}
        />
        <Item icon={Users} label="Max guests" value={homestay.maxGuests} />
        <Item
          icon={Home}
          label="Type"
          value={homestay.type === "ROOM" ? "Private room" : "Entire home"}
        />
      </div>
    </section>
  );
}

function Item({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-mitti-olive mt-0.5" />
      <div>
        <p className="text-xs text-mitti-dark-brown/60">{label}</p>
        <p className="font-medium text-mitti-dark-brown">{value}</p>
      </div>
    </div>
  );
}
