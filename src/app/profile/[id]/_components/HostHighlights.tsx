import { Home, Users, Star, Calendar } from "lucide-react";

interface Props {
  hostData: {
    hostingSince: number;
    homestaysCount: number;
    guestsHosted: number;
    averageRating: number | null;
  };
}

export default function HostHighlights({ hostData }: Props) {
  return (
    <div className="border-t border-mitti-khaki pt-8 space-y-4">
      <h2 className="text-xl font-semibold text-mitti-dark-brown flex items-center gap-2">
        <Star size={18} />
        Hosting highlights
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Stat
          icon={<Calendar size={16} />}
          label="Hosting since"
          value={hostData.hostingSince}
        />
        <Stat
          icon={<Home size={16} />}
          label="Homestays"
          value={hostData.homestaysCount}
        />
        <Stat
          icon={<Users size={16} />}
          label="Guests hosted"
          value={hostData.guestsHosted}
        />
        <Stat
          icon={<Star size={16} />}
          label="Rating"
          value={hostData.averageRating ?? "—"}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-mitti-khaki bg-mitti-beige p-4 text-center space-y-1">
      <div className="flex justify-center text-mitti-dark-brown">{icon}</div>
      <div className="text-lg font-semibold text-mitti-dark-brown">{value}</div>
      <div className="text-xs text-mitti-dark-brown/70">{label}</div>
    </div>
  );
}
