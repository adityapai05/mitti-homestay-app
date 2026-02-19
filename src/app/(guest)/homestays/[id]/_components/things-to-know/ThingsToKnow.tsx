import { HomestayDetailsDTO } from "../../types";
import CancellationInfo from "./CancellationInfo";
import HouseRules from "./HouseRules";
import TripPlanGenerator from "./TripPlanGenerator";

export default function ThingsToKnow({
  homestay,
}: {
  homestay: HomestayDetailsDTO;
}) {
  return (
    <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        Before you book
      </h2>

      <div className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CancellationInfo policies={homestay.policies} />

          <HouseRules
            checkIn={homestay.policies.checkInTime}
            checkOut={homestay.policies.checkOutTime}
            maxGuests={homestay.capacity.maxGuests}
          />
        </div>

        <div className="mt-6">
          <TripPlanGenerator
            homestayName={homestay.name}
            village={homestay.location.village ?? ""}
            district={homestay.location.district ?? ""}
            state={homestay.location.state ?? ""}
            category={homestay.category}
          />
        </div>
      </div>
    </section>
  );
}
