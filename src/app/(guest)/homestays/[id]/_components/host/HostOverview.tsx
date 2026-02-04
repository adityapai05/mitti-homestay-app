import { HomestayDetailsDTO } from "../../types";
import HostCard from "./HostCard";

interface HostSectionProps {
  homestay: HomestayDetailsDTO;
}

export default function HostOverview({ homestay }: HostSectionProps) {
  return (
    <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        Hosted By
      </h2>

      <HostCard host={homestay.host} />
    </section>
  );
}
