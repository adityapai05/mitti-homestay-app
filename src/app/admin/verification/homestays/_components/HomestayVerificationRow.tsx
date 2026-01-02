import { ChevronRight } from "lucide-react";

export default function HomestayVerificationRow({
  homestay,
  onClick,
}: {
  homestay: any;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-mitti-khaki hover:bg-mitti-beige cursor-pointer"
    >
      <td className="px-4 py-4 font-medium">{homestay.name}</td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {homestay.village}, {homestay.state}
      </td>

      <td className="px-4 py-4">{homestay.owner.name}</td>

      <td className="px-4 py-4">₹ {homestay.pricePerNight}</td>

      <td className="px-4 py-4 flex justify-between items-center">
        {new Date(homestay.createdAt).toLocaleDateString()}
        <ChevronRight size={16} className="opacity-60" />
      </td>
    </tr>
  );
}
