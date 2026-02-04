interface MetaRowProps {
  category: string;
  capacity: {
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  location: {
    village: string | null;
    state: string | null;
  };
}

export default function MetaRow({
  category,
  capacity,
  location,
}: MetaRowProps) {
  const parts = [
    category.replace("_", " ").toLowerCase(),
    `${capacity.maxGuests} guests`,
    `${capacity.bedrooms} bedroom`,
    `${capacity.bathrooms} bathroom`,
    [location.village, location.state].filter(Boolean).join(", "),
  ].filter(Boolean);

  return <p className="text-mitti-muted text-sm">{parts.join(" · ")}</p>;
}
