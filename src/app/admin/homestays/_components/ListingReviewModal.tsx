"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { X } from "lucide-react";

import Stepper from "@/app/admin/verification/homestays/_components/Stepper";
import OverviewSection from "@/app/admin/verification/homestays/_components/OverviewSection";
import ImageEvidenceSection from "@/app/admin/verification/homestays/_components/ImageEvidenceSection";
import DescriptionSection from "@/app/admin/verification/homestays/_components/DescriptionSection";
import LocationSection from "@/app/admin/verification/homestays/_components/LocationSection";
import HostAccountabilitySection from "@/app/admin/verification/homestays/_components/HostAccountabilitySection";

/* ---------- Types ---------- */

export type AdminListing = {
  id: string;
  name: string;

  description: string;
  amenities: string[];

  village?: string | null;
  district?: string | null;
  state?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  pricePerNight: string;
  maxGuests: number;
  type: "ROOM" | "HOME";

  imageUrl: string[];

  isVerified: boolean;
  rejectionReason?: string | null;

  owner: {
    id: string;
    name: string;
  };

  createdAt: string;
};

/* ---------- Adapter type ---------- */

type HomestayForReview = Omit<
  AdminListing,
  "type" | "latitude" | "longitude"
> & {
  type: "ROOM" | "HOME";
  latitude: number;
  longitude: number;
};

/* ---------- Steps ---------- */

const steps = ["Overview", "Images", "Description", "Location", "Host"];

/* ---------- Component ---------- */

export default function ListingReviewModal({
  listing,
  onClose,
}: {
  listing: AdminListing;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  /**
   * Adapter:
   * - ENTIRE_HOME -> HOME
   * - latitude / longitude normalized
   */
  const homestay: HomestayForReview = {
    ...listing,
    type: listing.type,
    latitude: listing.latitude ?? 0,
    longitude: listing.longitude ?? 0,
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-5xl h-[85vh] flex flex-col bg-mitti-cream border-mitti-khaki">
        {/* Header */}
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-xl text-mitti-dark-brown">
            Listing review
          </AlertDialogTitle>

          <button
            onClick={onClose}
            className="p-1 text-mitti-dark-brown/60 hover:text-mitti-dark-brown cursor-pointer"
          >
            <X size={18} />
          </button>
        </AlertDialogHeader>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={step} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && <OverviewSection homestay={homestay} />}
          {step === 1 && <ImageEvidenceSection homestay={homestay} />}
          {step === 2 && <DescriptionSection homestay={homestay} />}
          {step === 3 && <LocationSection homestay={homestay} />}
          {step === 4 && <HostAccountabilitySection homestay={homestay} />}
        </div>

        {/* Footer */}
        <div className="border-t border-mitti-khaki px-6 py-4 flex justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-mitti-dark-brown/70 disabled:opacity-40 cursor-pointer"
          >
            Back
          </button>

          <button
            disabled={step === steps.length - 1}
            onClick={() => setStep((s) => s + 1)}
            className="text-sm font-medium text-mitti-olive disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
