import HomestayVerificationRow from "./HomestayVerificationRow";

type Props = {
  homestays: any[];
  onSelect: (homestay: any) => void;
};

export default function HomestayVerificationTable({
  homestays,
  onSelect,
}: Props) {
  return (
    <div className="rounded-lg border border-mitti-khaki bg-mitti-cream overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-mitti-beige border-b border-mitti-khaki">
          <tr>
            <th className="px-4 py-3 text-left">Homestay</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Host</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {homestays.map((homestay) => (
            <HomestayVerificationRow
              key={homestay.id}
              homestay={homestay}
              onClick={() => onSelect(homestay)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
