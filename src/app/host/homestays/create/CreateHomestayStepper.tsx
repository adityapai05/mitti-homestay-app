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
    import MapConfirmModal from "./MapConfirmModal";
    import type { LocationValue } from "./steps/StepLocationMap";
    import type { AddressValue } from "./steps/StepAddress";

    import { ArrowLeft, ArrowRight } from "lucide-react";
    import StepReview from "./steps/StepReview";

    const TOTAL_STEPS = 10;

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
    }>({});

    const handleNext = () => {
        if (currentStep === 3) {
        setShowMapConfirm(true);
        return;
        }

        if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
        }
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

            address: formData.address
                ? [
                    formData.address.street,
                    formData.address.landmark,
                    formData.address.city,
                    formData.address.district,
                    formData.address.state,
                    formData.address.pincode,
                ]
                    .filter(Boolean)
                    .join(", ")
                : "",

            latitude: formData.location?.latitude,
            longitude: formData.location?.longitude,

            pricePerNight: formData.pricePerNight,

            maxGuests: basics.guests,
            beds: basics.beds,
            bedrooms: basics.bedrooms,
            bathrooms: basics.bathrooms,

            imageUrl: formData.images,
            amenities: formData.amenities,
            }),
        });

        if (!res.ok) throw new Error("Failed to create homestay");

        // redirect or success toast
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
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
                }
            />
            );

        case 1:
            return (
            <StepType
                value={formData.type}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
                }
            />
            );

        case 2:
            return (
            <StepLocationMap
                value={formData.location}
                onChange={(value) =>
                setFormData((prev) => ({
                    ...prev,
                    location: value,
                    address: {
                    country: "India",
                    city: value.address.city || "",
                    district: value.address.district || "",
                    state: value.address.state || "",
                    pincode: value.address.pincode || "",
                    street: "",
                    landmark: "",
                    flat: "",
                    },
                }))
                }
            />
            );

        case 3:
            return (
            <StepAddress
                value={formData.address}
                location={formData.location}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, address: value }))
                }
            />
            );

        case 4:
            return (
            <StepBasics
                value={formData.basics}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, basics: value }))
                }
            />
            );

        case 5:
            return (
            <StepAmenities
                value={formData.amenities}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, amenities: value }))
                }
            />
            );

        case 6:
            return (
            <StepPhotos
                value={formData.images}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, images: value }))
                }
            />
            );

        case 7:
            return (
            <StepAbout
                title={formData.name}
                description={formData.description}
                onChange={({ title, description }) =>
                setFormData((prev) => ({
                    ...prev,
                    name: title,
                    description,
                }))
                }
            />
            );

        case 8:
            return (
            <StepPricing
                value={formData.pricePerNight}
                onChange={(value) =>
                setFormData((prev) => ({ ...prev, pricePerNight: value }))
                }
            />
            );

        case 9:
            return <StepReview data={formData} />;

        default:
            return <div className="text-mitti-dark-brown">Step coming soon</div>;
        }
    };

    const canProceed =
        currentStep === 0
        ? Boolean(formData.category)
        : currentStep === 1
        ? Boolean(formData.type)
        : currentStep === 2
        ? Boolean(formData.location)
        : currentStep === 3
        ? Boolean(
            formData.address?.city &&
                formData.address?.state &&
                /^[0-9]{6}$/.test(formData.address?.pincode || "")
            )
        : currentStep === 4
        ? true
        : currentStep === 5
        ? true
        : currentStep === 6
        ? (formData.images?.length || 0) >= 5
        : currentStep === 7
        ? Boolean(formData.name && formData.description)
        : currentStep === 8
        ? Boolean(
            formData.pricePerNight &&
                formData.pricePerNight >= 300 &&
                formData.pricePerNight <= 20000
            )
        : true;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige flex flex-col">
        {/* Progress bar */}
        <div className="px-4 sm:px-6 py-4">
            <div className="max-w-5xl mx-auto">
            <div className="h-1 w-full bg-mitti-khaki rounded">
                <div
                className="h-1 bg-mitti-brown rounded transition-all"
                style={{
                    width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                }}
                />
            </div>
            </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex items-center justify-center px-4 pb-28">
            <div className="w-full">{renderStep()}</div>
        </div>

        {/* Sticky navigation */}
        <div className="sticky bottom-0 z-50 border-t border-mitti-khaki bg-mitti-cream px-4 sm:px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 text-mitti-dark-brown disabled:opacity-40 cursor-pointer hover:underline"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            {currentStep === TOTAL_STEPS - 1 ? (
                <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-2 rounded-lg bg-mitti-brown text-white font-medium cursor-pointer hover:bg-mitti-brown/90"
                >
                {publishing ? "Publishing…" : "Publish listing"}
                </button>
            ) : (
                <button
                onClick={handleNext}
                disabled={!canProceed}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-mitti-brown text-white font-medium cursor-pointer hover:bg-mitti-brown/90"
                >
                Next
                <ArrowRight size={18} />
                </button>
            )}
            </div>
        </div>
        <MapConfirmModal
            open={showMapConfirm}
            location={formData.location!}
            onClose={() => setShowMapConfirm(false)}
            onConfirm={() => {
            setShowMapConfirm(false);
            setCurrentStep((prev) => prev + 1);
            }}
        />
        </div>
    );
    };

    export default CreateHomestayStepper;
