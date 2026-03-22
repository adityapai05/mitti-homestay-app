"use client";

import { useMemo, useState } from "react";
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
import { createSchema as homestayCreateSchema } from "@/lib/validation/homestaySchemas";
import { z } from "zod";

const TOTAL_STEPS = 11;
const MAX_AMENITIES = 40;
const MAX_IMAGES = 25;

const stepSchemas = {
  0: z.object({ category: homestayCreateSchema.shape.category }),
  1: z.object({ type: homestayCreateSchema.shape.type }),
  2: z.object({
    latitude: homestayCreateSchema.shape.latitude,
    longitude: homestayCreateSchema.shape.longitude,
  }),
  3: z.object({
    flatno: homestayCreateSchema.shape.flatno,
    street: homestayCreateSchema.shape.street,
    village: homestayCreateSchema.shape.village,
    state: homestayCreateSchema.shape.state,
    pincode: homestayCreateSchema.shape.pincode,
  }),
  4: z.object({
    maxGuests: homestayCreateSchema.shape.maxGuests,
    bedrooms: homestayCreateSchema.shape.bedrooms,
    beds: homestayCreateSchema.shape.beds,
    bathrooms: homestayCreateSchema.shape.bathrooms,
    checkInTime: homestayCreateSchema.shape.checkInTime,
    checkOutTime: homestayCreateSchema.shape.checkOutTime,
  }),
  5: z.object({ amenities: homestayCreateSchema.shape.amenities }),
  6: z.object({ imageUrl: homestayCreateSchema.shape.imageUrl }),
  7: z.object({
    name: homestayCreateSchema.shape.name,
    description: homestayCreateSchema.shape.description,
  }),
  8: z.object({ pricePerNight: homestayCreateSchema.shape.pricePerNight }),
  9: z.object({
    cancellationPolicy: homestayCreateSchema.shape.cancellationPolicy,
  }),
} as const;

type StepIndex = keyof typeof stepSchemas;

const toErrorMessage = (error: z.ZodError) =>
  error.issues[0]?.message ?? "Please correct this step before continuing.";

const sanitizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const CreateHomestayStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMapConfirm, setShowMapConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

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

  const fullPayload = useMemo(() => {
    const basics = formData.basics ?? {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      checkInTime: "14:00",
      checkOutTime: "11:00",
    };

    return {
      name: sanitizeText(formData.name ?? ""),
      description: sanitizeText(formData.description ?? ""),
      category: formData.category,
      type: formData.type,
      flatno: sanitizeText(formData.address?.flatno ?? ""),
      street: sanitizeText(formData.address?.street ?? ""),
      landmark: sanitizeText(formData.address?.landmark ?? ""),
      village: sanitizeText(formData.address?.village ?? ""),
      district: sanitizeText(formData.address?.district ?? ""),
      state: sanitizeText(formData.address?.state ?? ""),
      pincode: formData.address?.pincode?.trim() || undefined,
      latitude: formData.location?.latitude,
      longitude: formData.location?.longitude,
      pricePerNight: formData.pricePerNight,
      maxGuests: basics.guests,
      beds: basics.beds,
      bedrooms: basics.bedrooms,
      bathrooms: basics.bathrooms,
      imageUrl: (formData.images ?? []).slice(0, MAX_IMAGES),
      amenities: Array.from(
        new Set((formData.amenities ?? []).map((item) => sanitizeText(item))),
      )
        .filter(Boolean)
        .slice(0, MAX_AMENITIES),
      cancellationPolicy: formData.cancellationPolicy,
      checkInTime: basics.checkInTime,
      checkOutTime: basics.checkOutTime,
    };
  }, [formData]);

  const currentStepValidationError = useMemo(() => {
    if (currentStep < 0 || currentStep > 9) return null;
    const schema = stepSchemas[currentStep as StepIndex];

    const stepData: Record<number, unknown> = {
      0: { category: fullPayload.category },
      1: { type: fullPayload.type },
      2: { latitude: fullPayload.latitude, longitude: fullPayload.longitude },
      3: {
        flatno: fullPayload.flatno,
        street: fullPayload.street,
        village: fullPayload.village,
        state: fullPayload.state,
        pincode: fullPayload.pincode,
      },
      4: {
        maxGuests: fullPayload.maxGuests,
        bedrooms: fullPayload.bedrooms,
        beds: fullPayload.beds,
        bathrooms: fullPayload.bathrooms,
        checkInTime: fullPayload.checkInTime,
        checkOutTime: fullPayload.checkOutTime,
      },
      5: { amenities: fullPayload.amenities },
      6: { imageUrl: fullPayload.imageUrl },
      7: { name: fullPayload.name, description: fullPayload.description },
      8: { pricePerNight: fullPayload.pricePerNight },
      9: { cancellationPolicy: fullPayload.cancellationPolicy },
    };

    const parsed = schema.safeParse(stepData[currentStep]);
    return parsed.success ? null : toErrorMessage(parsed.error);
  }, [currentStep, fullPayload]);

  const canProceed = !currentStepValidationError;

  const handleNext = () => {
    if (currentStepValidationError) {
      setStepError(currentStepValidationError);
      return;
    }

    setStepError(null);

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
    if (publishing) return;

    const validatedPayload = homestayCreateSchema.safeParse(fullPayload);
    if (!validatedPayload.success) {
      const message = toErrorMessage(validatedPayload.error);
      setStepError(message);
      toast.error(message);
      return;
    }

    setPublishing(true);

    try {
      const res = await fetch("/api/homestays/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedPayload.data),
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepCategory
            value={formData.category}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({ ...p, category: v }));
            }}
          />
        );

      case 1:
        return (
          <StepType
            value={formData.type}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({ ...p, type: v }));
            }}
          />
        );

      case 2:
        return (
          <StepLocationMap
            value={formData.location}
            onChange={(value) => {
              setStepError(null);
              setFormData((p) => ({
                ...p,
                location: {
                  ...value,
                  label: sanitizeText(value.label),
                },
                address: {
                  flatno: "",
                  street: "",
                  landmark: "",
                  village: sanitizeText(value.address.city || ""),
                  district: sanitizeText(value.address.district || ""),
                  state: sanitizeText(value.address.state || ""),
                  pincode: (value.address.pincode || "").replace(/\D/g, "").slice(0, 6),
                },
              }));
            }}
          />
        );

      case 3:
        return (
          <StepAddress
            value={formData.address}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({
                ...p,
                address: {
                  flatno: sanitizeText(v.flatno),
                  street: sanitizeText(v.street),
                  landmark: sanitizeText(v.landmark ?? ""),
                  village: sanitizeText(v.village),
                  district: sanitizeText(v.district ?? ""),
                  state: sanitizeText(v.state),
                  pincode: v.pincode.replace(/\D/g, "").slice(0, 6),
                },
              }));
            }}
          />
        );

      case 4:
        return (
          <StepBasics
            value={formData.basics}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({
                ...p,
                basics: {
                  guests: Math.min(50, Math.max(1, Math.trunc(v.guests))),
                  bedrooms: Math.min(50, Math.max(0, Math.trunc(v.bedrooms))),
                  beds: Math.min(50, Math.max(1, Math.trunc(v.beds))),
                  bathrooms: Math.min(50, Math.max(0, Math.trunc(v.bathrooms))),
                  checkInTime: v.checkInTime,
                  checkOutTime: v.checkOutTime,
                },
              }));
            }}
          />
        );

      case 5:
        return (
          <StepAmenities
            value={formData.amenities}
            onChange={(v) => {
              setStepError(null);
              const safeAmenities = Array.from(
                new Set(v.map((item) => sanitizeText(item)).filter(Boolean)),
              ).slice(0, MAX_AMENITIES);
              setFormData((p) => ({ ...p, amenities: safeAmenities }));
            }}
          />
        );

      case 6:
        return (
          <StepPhotos
            value={formData.images}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({ ...p, images: v.slice(0, MAX_IMAGES) }));
            }}
          />
        );

      case 7:
        return (
          <StepAbout
            title={formData.name}
            description={formData.description}
            category={formData.category}
            location={[
              formData.address?.village,
              formData.address?.district,
              formData.address?.state,
            ]
              .filter(Boolean)
              .join(", ")}
            onChange={({ title, description }) => {
              setStepError(null);
              setFormData((p) => ({
                ...p,
                name: title,
                description,
              }));
            }}
          />
        );

      case 8:
        return (
          <StepPricing
            value={formData.pricePerNight}
            location={[
              formData.address?.village,
              formData.address?.district,
              formData.address?.state,
            ]
              .filter(Boolean)
              .join(", ")}
            category={formData.category}
            beds={formData.basics?.beds}
            maxGuests={formData.basics?.guests}
            amenities={formData.amenities}
            averageLocalPrice={formData.pricePerNight ?? null}
            onChange={(v) => {
              setStepError(null);
              const numeric = Number(v);
              if (!Number.isFinite(numeric)) {
                setFormData((p) => ({ ...p, pricePerNight: undefined }));
                return;
              }
              setFormData((p) => ({
                ...p,
                pricePerNight: Math.min(100000, Math.max(1, Math.trunc(numeric))),
              }));
            }}
          />
        );

      case 9:
        return (
          <StepCancellationPolicy
            value={formData.cancellationPolicy}
            onChange={(v) => {
              setStepError(null);
              setFormData((p) => ({ ...p, cancellationPolicy: v }));
            }}
          />
        );

      case 10:
        return <StepReview data={formData} />;

      default:
        return null;
    }
  };

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
                disabled={publishing || Boolean(currentStepValidationError)}
                className="px-6 py-2 rounded-lg bg-mitti-brown text-white cursor-pointer hover:bg-mitti-brown/90"
              >
                {publishing ? "Publishing..." : "Publish listing"}
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
          {(stepError || currentStepValidationError) && (
            <p className="mt-3 text-sm text-red-600">
              {stepError || currentStepValidationError}
            </p>
          )}
        </div>
      </div>

      <MapConfirmModal
        open={showMapConfirm}
        location={formData.location!}
        onClose={() => setShowMapConfirm(false)}
        onConfirm={() => {
          if (currentStepValidationError) {
            setStepError(currentStepValidationError);
            return;
          }

          setShowMapConfirm(false);
          setCurrentStep((p) => p + 1);
        }}
      />
    </div>
  );
};

export default CreateHomestayStepper;