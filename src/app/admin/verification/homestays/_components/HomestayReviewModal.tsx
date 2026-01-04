"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/prebuilt-components/alert-dialog";

import Stepper from "./Stepper";
import OverviewSection from "./OverviewSection";
import ImageEvidenceSection from "./ImageEvidenceSection";
import DescriptionSection from "./DescriptionSection";
import LocationSection from "./LocationSection";
import HostAccountabilitySection from "./HostAccountabilitySection";
import DecisionSection from "./DecisionSection";
import type { AdminHomestayDetails } from "@/types";

const steps = [
  "Overview",
  "Images",
  "Description",
  "Location",
  "Host",
  "Decision",
];

export default function HomestayReviewModal({
  homestay,
  onClose,
}: {
  homestay: AdminHomestayDetails;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-5xl h-[85vh] flex flex-col bg-mitti-cream border-mitti-khaki">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-mitti-dark-brown">
            Homestay Verification
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Stepper steps={steps} currentStep={step} />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && (
            <OverviewSection
              homestay={{
                village: homestay.village,
                pricePerNight: homestay.pricePerNight,
                maxGuests: homestay.maxGuests,
                type: homestay.type,
              }}
            />
          )}

          {step === 1 && (
            <ImageEvidenceSection homestay={{ imageUrl: homestay.imageUrl }} />
          )}

          {step === 2 && (
            <DescriptionSection
              homestay={{
                ...homestay,
                description: homestay.description,
                amenities: homestay.amenities,
              }}
            />
          )}

          {step === 3 && (
            <LocationSection
              homestay={{
                latitude: homestay.latitude,
                longitude: homestay.longitude,
                village: homestay.village,
                district: homestay.district,
                state: homestay.state,
              }}
            />
          )}

          {step === 4 && <HostAccountabilitySection homestay={homestay} />}

          {step === 5 && (
            <DecisionSection homestay={homestay} onClose={onClose} />
          )}
        </div>

        <div className="border-t border-mitti-khaki px-6 py-4 flex justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-mitti-dark-brown/70 disabled:opacity-40"
          >
            Back
          </button>

          <button
            disabled={step === steps.length - 1}
            onClick={() => setStep((s) => s + 1)}
            className="text-sm font-medium text-mitti-olive disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
