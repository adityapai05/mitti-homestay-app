"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HostBookingsCard from "../_components/HostBookingsCard";
import HostBookingsEmpty from "../_components/HostBookingsEmpty";
import HostBookingsLoading from "../_components/HostBookingsLoading";

type HostBooking = {
  id: string;
  status: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  createdAt: string;
  guest: {
    id: string;
    name: string;
    image: string | null;
  };
  homestay: {
    id: string;
    name: string;
    imageUrl: string[];
    displayAddress: string;
  };
  hostActions: {
    canApprove: boolean;
    canReject: boolean;
    isUpcoming: boolean;
    isActive: boolean;
    isPast: boolean;
  };
};

export default function HostBookingsList() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "pending";

  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBookings() {
      setLoading(true);

      const params = new URLSearchParams();
      if (tab === "pending") params.set("pending", "true");
      if (tab === "upcoming") params.set("upcoming", "true");
      if (tab === "past") params.set("past", "true");

      try {
        const res = await fetch(`/api/host/bookings?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data.bookings ?? []);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("[HOST_BOOKINGS_FETCH]", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();

    return () => controller.abort();
  }, [tab]);

  if (loading) {
    return <HostBookingsLoading />;
  }

  if (bookings.length === 0) {
    return <HostBookingsEmpty />;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <HostBookingsCard
          key={booking.id}
          booking={{
            id: booking.id,
            status: booking.status,
            checkIn: new Date(booking.checkIn),
            checkOut: new Date(booking.checkOut),
            guests: booking.guests,
            homestay: booking.homestay,
            user: booking.guest,
            hostActions: booking.hostActions,
          }}
        />
      ))}
    </div>
  );
}
