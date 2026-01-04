import { ChevronRight } from "lucide-react";
import type { AdminHomestay } from "./HomestayVerificationTable";

/* ---------- component ---------- */

export default function HomestayVerificationRow({
  homestay,
  onClick,
}: {
  homestay: AdminHomestay;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-mitti-khaki hover:bg-mitti-beige cursor-pointer"
    >
      <td className="px-4 py-4 font-medium text-mitti-dark-brown">
        {homestay.name}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {[homestay.village, homestay.state].filter(Boolean).join(", ") || "—"}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown">{homestay.owner.name}</td>

      <td className="px-4 py-4 text-mitti-dark-brown">
        ₹ {homestay.pricePerNight}
      </td>

      <td className="px-4 py-4 flex justify-between items-center text-mitti-dark-brown/80">
        {new Date(homestay.createdAt).toLocaleDateString()}
        <ChevronRight size={16} className="opacity-60" />
      </td>
    </tr>
  );
}
