"use client";

import { useState } from "react";
import StepCategory from "./steps/StepCategory";
import StepType from "./steps/StepType";
import StepLocationMap from "./steps/StepLocationMap";
import StepAddress from "./steps/StepAddress";
import StepBasics, { type BasicsValue } from "./steps/StepBasics";
import StepAmenities from "./steps/StepAmenities";
import StepPhotos from "./steps/StepPhotos";
import StepAbout from "./steps/StepAbout";
import StepPricing from "./steps/StepPricing";
import StepReview from "./steps/StepReview";
import StepCancellationPolicy from "./steps/StepCancellationPolicy";
import MapConfirmModal from "./MapConfirmModal";

import type { LocationValue } from "./steps/StepLocationMap";
import type { AddressValue } from "./steps/StepAddress";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TOTAL_STEPS = 11;

const CreateHomestayStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMapConfirm, setShowMapConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [formData, setFormData] = useState<{
    category?: string;
    type?: "ROOM" | "HOME";
    location?: LocationValue;
    address?: AddressValue;
    basics?: BasicsValue;
    amenities?: string[];
    images?: string[];
    name?: string;
    description?: string;
    pricePerNight?: number;
    cancellationPolicy?: "FLEXIBLE" | "MODERATE" | "STRICT";
  }>({});

  const router = useRouter();

  /* ---------------- navigation ---------------- */

  const handleNext = () => {
    if (currentStep === 3) {
      setShowMapConfirm(true);
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    setCurrentStep((p) => p - 1);
  };

  const handlePublish = async () => {
    setPublishing(true);

    try {
      const basics = formData.basics ?? {
        guests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
      };

      const res = await fetch("/api/homestays/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          type: formData.type,

          flatno: formData.address?.flatno,
          street: formData.address?.street,
          landmark: formData.address?.landmark,
          village: formData.address?.village,
          district: formData.address?.district,
          state: formData.address?.state,
          pincode: formData.address?.pincode,

          latitude: formData.location?.latitude,
          longitude: formData.location?.longitude,

          pricePerNight: formData.pricePerNight,
          
          maxGuests: basics.guests,
          beds: basics.beds,
          bedrooms: basics.bedrooms,
          bathrooms: basics.bathrooms,
          
          imageUrl: formData.images,
          amenities: formData.amenities,

          cancellationPolicy: formData.cancellationPolicy,
        }),
      });

      if (!res.ok) throw new Error("Failed to create homestay");

      toast.success("Homestay created successfully", {
        description: "Your listing is pending verification.",
      });

      router.push("/host/homestays");
    } catch {
      toast.error("Something went wrong", {
        description: "Please try publishing again.",
      });
    } finally {
      setPublishing(false);
    }
  };

  /* ---------------- steps ---------------- */

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepCategory
            value={formData.category}
            onChange={(v) => setFormData((p) => ({ ...p, category: v }))}
          />
        );

      case 1:
        return (
          <StepType
            value={formData.type}
            onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
          />
        );

      case 2:
        return (
          <StepLocationMap
            value={formData.location}
            onChange={(value) =>
              setFormData((p) => ({
                ...p,
                location: value,
                address: {
                  flatno: "",
                  street: "",
                  landmark: "",
                  village: value.address.city || "",
                  district: value.address.district,
                  state: value.address.state || "",
                  pincode: value.address.pincode || "",
                },
              }))
            }
          />
        );

      case 3:
        return (
          <StepAddress
            value={formData.address}
            onChange={(v) => setFormData((p) => ({ ...p, address: v }))}
          />
        );

      case 4:
        return (
          <StepBasics
            value={formData.basics}
            onChange={(v) => setFormData((p) => ({ ...p, basics: v }))}
          />
        );

      case 5:
        return (
          <StepAmenities
            value={formData.amenities}
            onChange={(v) => setFormData((p) => ({ ...p, amenities: v }))}
          />
        );

      case 6:
        return (
          <StepPhotos
            value={formData.images}
            onChange={(v) => setFormData((p) => ({ ...p, images: v }))}
          />
        );

      case 7:
        return (
          <StepAbout
            title={formData.name}
            description={formData.description}
            onChange={({ title, description }) =>
              setFormData((p) => ({ ...p, name: title, description }))
            }
          />
        );

      case 8:
        return (
          <StepPricing
            value={formData.pricePerNight}
            onChange={(v) => setFormData((p) => ({ ...p, pricePerNight: v }))}
          />
        );

      case 9:
        return (
          <StepCancellationPolicy
            value={formData.cancellationPolicy}
            onChange={(v) =>
              setFormData((p) => ({ ...p, cancellationPolicy: v }))
            }
          />
        );

      case 10:
        return <StepReview data={formData} />;

      default:
        return null;
    }
  };

  /* ---------------- validation ---------------- */

  const canProceed =
    currentStep === 0
      ? Boolean(formData.category)
      : currentStep === 1
        ? Boolean(formData.type)
        : currentStep === 2
          ? Boolean(formData.location)
          : currentStep === 3
            ? Boolean(
                formData.address?.village &&
                formData.address?.state &&
                formData.address?.flatno &&
                formData.address?.street &&
                /^[0-9]{6}$/.test(formData.address?.pincode || "")
              )
            : currentStep === 6
              ? (formData.images?.length || 0) >= 5
              : currentStep === 7
                ? Boolean(formData.name && formData.description)
                : currentStep === 8
                  ? Boolean(
                      formData.pricePerNight &&
                      formData.pricePerNight >= 150 &&
                      formData.pricePerNight <= 10000
                    )
                  : currentStep === 9
                    ? Boolean(formData.cancellationPolicy)
                    : true;

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen bg-mitti-beige flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 pb-32">
        <div className="w-full">{renderStep()}</div>
      </div>

      <div className="sticky bottom-0 z-[100] bg-mitti-cream border-t border-mitti-khaki">
        <div className="h-1 w-full bg-mitti-khaki">
          <div
            className="h-1 bg-mitti-brown transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-mitti-dark-brown cursor-pointer hover:underline"
            >
              <ArrowLeft size={18} />
              {currentStep === 0 ? "Exit" : "Back"}
            </button>

            {currentStep === TOTAL_STEPS - 1 ? (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-2 rounded-lg bg-mitti-brown text-white cursor-pointer hover:bg-mitti-brown/90"
              >
                {publishing ? "Publishing…" : "Publish listing"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg ${
                  canProceed
                    ? "bg-mitti-brown text-white cursor-pointer hover:bg-mitti-brown/90"
                    : "bg-mitti-khaki text-mitti-dark-brown cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <MapConfirmModal
        open={showMapConfirm}
        location={formData.location!}
        onClose={() => setShowMapConfirm(false)}
        onConfirm={() => {
          setShowMapConfirm(false);
          setCurrentStep((p) => p + 1);
        }}
      />
    </div>
  );
};

export default CreateHomestayStepper;
