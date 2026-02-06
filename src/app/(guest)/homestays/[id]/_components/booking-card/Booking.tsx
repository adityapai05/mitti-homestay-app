"use client";

import DesktopBookingCard from "./DesktopBookingCard";
import MobileBookingBar from "./MobileBookingBar";
import type { HomestayDetailsDTO } from "../../types";

interface BookingProps {
  homestay: HomestayDetailsDTO;
}

export default function Booking({ homestay }: BookingProps) {
  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <DesktopBookingCard homestay={homestay} />
        </div>
      </div>

      <MobileBookingBar homestay={homestay} />
    </>
  );
}
