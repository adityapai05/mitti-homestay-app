import { notFound } from "next/navigation";
import axios from "axios";
import { Homestay } from "@/types";
import HeroSection from "@/components/ui/homestaydetailspage/HeroSection";
import HostInfoSection from "@/components/ui/homestaydetailspage/HostInfoSection";
import DescriptionSection from "@/components/ui/homestaydetailspage/DescriptionSection";
import AmenitiesSection from "@/components/ui/homestaydetailspage/AmenitiesSection";
import DetailsGridSection from "@/components/ui/homestaydetailspage/DetailsGridSection";
import ReviewsSection from "@/components/ui/homestaydetailspage/ReviewsSection";
import PricingBookingSection from "@/components/ui/homestaydetailspage/PricingBookingSection";

interface HomestayDetailsProps {
  params: Promise<{ id: string }>;
}

async function getHomestay(id: string): Promise<Homestay | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    console.log("Base URL:", baseUrl); 
    const response = await fetch(`${baseUrl}/api/homestays/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Fetch failed: ${response.status} ${response.statusText}`);
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched homestay data:", data); // Debug
    return data as Homestay;
  } catch (error) {
    console.error("[GET homestay/[id]]", error);
    return null;
  }
}

export default async function HomestayDetails({
  params,
}: HomestayDetailsProps) {
  const { id } = await params;
  const homestay = await getHomestay(id);
  console.log("Homestay data:", homestay);

  if (!homestay) {
    notFound();
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
