"use client";

import { useEffect, useState } from "react";
import StayCard from "./StayCard";
import EmptyState from "./EmptyState";
import { Stay } from "./types";

interface Props {
  type: "upcoming" | "past";
}

export default function StayList({ type }: Props) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStays() {
      setLoading(true);
      const res = await fetch(
        `/api/bookings?${type === "upcoming" ? "upcoming=true" : "past=true"}`
      );
      const data = await res.json();
      setStays(data.bookings || []);
      setLoading(false);
    }

    fetchStays();
  }, [type]);

  if (loading) return null;

  if (stays.length === 0) {
    return <EmptyState type={type} />;
  }

  return (
    <div className="space-y-4">
      {stays.map((stay) => (
        <StayCard key={stay.id} stay={stay} />
      ))}
    </div>
  );
}
