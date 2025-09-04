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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/homestays/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
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
