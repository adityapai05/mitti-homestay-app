"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import HeroSection from "@/components/ui/homestaydetailspage/HeroSection";
import HostInfoSection from "@/components/ui/homestaydetailspage/HostInfoSection";
import DescriptionSection from "@/components/ui/homestaydetailspage/DescriptionSection";
import AmenitiesSection from "@/components/ui/homestaydetailspage/AmenitiesSection";
import DetailsGridSection from "@/components/ui/homestaydetailspage/DetailsGridSection";
import ReviewsSection from "@/components/ui/homestaydetailspage/ReviewsSection";
import PricingBookingSection from "@/components/ui/homestaydetailspage/PricingBookingSection";
import HomestayNotFoundPage from "@/app/(guest)/homestays/[id]/not-found";
import { Homestay } from "@/types";
import { Loader2 } from "lucide-react";

export default function HomestayDetails() {
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchHomestay = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/homestays/${id}`);
        console.log("Fetched homestay data:", response.data);
        setHomestay(response.data as Homestay);
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.error("[GET homestays/[id]]", err);
        if (error.response?.status === 404) {
          setError("Homestay not found");
        } else {
          setError("An error occurred while fetching the homestay");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHomestay();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mitti-cream to-mitti-beige">
        <div className="flex flex-col items-center pt-20">
          <Loader2 className="size-16 text-mitti-brown animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-mitti-dark-brown">
            Loading Homestay...
          </h2>
          <p className="text-mitti-muted mt-1">
            Exploring the perfect retreat for you!
          </p>
        </div>
      </div>
    );
  }

  if (error || !homestay) {
    return <HomestayNotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-mitti-beige">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-8">
        <div className="lg:col-span-2 space-y-8">
          <HeroSection homestay={homestay} />
          <HostInfoSection homestay={homestay} />
          <DescriptionSection homestay={homestay} />
          <AmenitiesSection homestay={homestay} />
          <DetailsGridSection homestay={homestay} />
          <ReviewsSection homestayId={homestay.id} />
        </div>
        <div className="lg:col-span-1">
          <PricingBookingSection homestay={homestay} />
        </div>
      </div>
    </div>
  );
}
