"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import EditorSidebar from "./EditorSidebar";
import EditorHeader from "./EditorHeader";
import { HomestayEditorData } from "./types";

import PhotosEditor from "./editors/PhotosEditors";
import TitleEditor from "./editors/TitleEditor";
import DescriptionEditor from "./editors/DescriptionEditor";
import PricingEditor from "./editors/PricingEditor";
import BasicsEditor from "./editors/BasicsEditor";
import AmenitiesEditor from "./editors/AmenitiesEditor";
import LocationEditor from "./editors/LocationEditor";
import ListingSettingsEditor from "./editors/ListingSettingsEditor";

import DeleteListingDialog from "@/components/host/DeleteListingDialog";
import { routeParamSchema, updateSchema as homestayUpdateSchema } from "@/lib/validation/homestaySchemas";

type EditorSection =
  | "photos"
  | "title"
  | "description"
  | "pricing"
  | "basics"
  | "amenities"
  | "location"
  | "settings";

const AUTOSAVE_DELAY = 1200;
const MAX_AMENITIES = 40;
const MAX_IMAGES = 25;
const sanitizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const EditorShell = ({ homestay }: { homestay: HomestayEditorData }) => {
  const router = useRouter();
  const initialRef = useRef(homestay);

  const [activeSection, setActiveSection] = useState<EditorSection>("photos");
  const [draft, setDraft] = useState(homestay);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initialRef.current),
    [draft],
  );

  const updatePayload = useMemo(
    () => ({
      name: sanitizeText(draft.name),
      description: sanitizeText(draft.description),
      imageUrl: draft.imageUrl.slice(0, MAX_IMAGES),
      category: draft.category,
      type: draft.type,
      pricePerNight: draft.pricePerNight ?? undefined,
      maxGuests: Math.min(50, Math.max(1, Math.trunc(draft.maxGuests))),
      beds: Math.min(50, Math.max(1, Math.trunc(draft.beds))),
      bedrooms: Math.min(50, Math.max(0, Math.trunc(draft.bedrooms))),
      bathrooms: Math.min(50, Math.max(0, Math.trunc(draft.bathrooms))),
      amenities: Array.from(
        new Set(draft.amenities.map((item) => sanitizeText(item)).filter(Boolean)),
      ).slice(0, MAX_AMENITIES),
      flatno: sanitizeText(draft.flatno),
      street: sanitizeText(draft.street),
      landmark: sanitizeText(draft.landmark ?? ""),
      village: sanitizeText(draft.village),
      district: sanitizeText(draft.district ?? ""),
      state: sanitizeText(draft.state),
      pincode: draft.pincode.replace(/\D/g, "").slice(0, 6),
      latitude: draft.latitude,
      longitude: draft.longitude,
      guideAvailable: draft.guideAvailable,
      guideFee:
        draft.guideAvailable && draft.guideFee !== null
          ? Math.min(100000, Math.max(1, Math.trunc(draft.guideFee)))
          : null,
      checkInTime: draft.checkInTime ?? "14:00",
      checkOutTime: draft.checkOutTime ?? "11:00",
      cancellationPolicy: draft.cancellationPolicy,
    }),
    [draft],
  );

  const handleSave = useCallback(async () => {
    if (!isDirty || isSaving) return;
    const parsedPayload = homestayUpdateSchema.safeParse(updatePayload);
    if (!parsedPayload.success) {
      const errorMessage =
        parsedPayload.error.issues[0]?.message ??
        "Please fix validation errors before saving.";
      setValidationError(errorMessage);
      return;
    }

    try {
      setIsSaving(true);
      setValidationError(null);
      const res = await fetch(`/api/host/homestays/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedPayload.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }
      initialRef.current = draft;
      setLastSavedAt(new Date());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [draft, isDirty, isSaving, updatePayload]);

  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(handleSave, AUTOSAVE_DELAY);
    return () => clearTimeout(t);
  }, [handleSave, isDirty]);

  return (
    <>
      <DeleteListingDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={deleting}
        onConfirm={async () => {
          const parsedId = routeParamSchema.safeParse({ id: draft.id });
          if (!parsedId.success) {
            toast.error("Invalid listing identifier.");
            return;
          }

          try {
            setDeleting(true);
            const res = await fetch(`/api/host/homestays/${parsedId.data.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              const data = await res.json().catch(() => null);
              throw new Error(data?.error ?? "Failed to delete listing");
            }
            router.push("/host/homestays");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to delete listing",
            );
          } finally {
            setDeleting(false);
          }
        }}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        <EditorSidebar
          open={sidebarOpen}
          draft={draft}
          activeSection={activeSection}
          onClose={() => setSidebarOpen(false)}
          onSectionChange={(s) => {
            setActiveSection(s);
            setSidebarOpen(false);
          }}
        />

        <div className="flex flex-1 flex-col">
          <EditorHeader
            homestayId={draft.id}
            title={draft.name}
            isVerified={draft.isVerified}
            isSaving={isSaving}
            isDirty={isDirty}
            lastSavedAt={lastSavedAt}
            onSaveAndExit={async () => {
              await handleSave();
              router.push("/host/homestays");
            }}
            onExit={() => {
              router.push("/host/homestays");
            }}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-10">
              {validationError && (
                <p className="text-sm text-red-600">{validationError}</p>
              )}
              {activeSection === "photos" && (
                <PhotosEditor
                  images={draft.imageUrl}
                  onChange={(imageUrl) => setDraft((p) => ({ ...p, imageUrl }))}
                />
              )}
              {activeSection === "title" && (
                <TitleEditor
                  value={draft.name}
                  onChange={(name) => setDraft((p) => ({ ...p, name }))}
                />
              )}
              {activeSection === "description" && (
                <DescriptionEditor
                  value={draft.description}
                  category={draft.category}
                  location={[draft.village, draft.district, draft.state]
                    .filter(Boolean)
                    .join(", ")}
                  onChange={(description) =>
                    setDraft((p) => ({ ...p, description }))
                  }
                />
              )}
              {activeSection === "pricing" && (
                <PricingEditor
                  value={draft.pricePerNight}
                  location={[draft.village, draft.district, draft.state]
                    .filter(Boolean)
                    .join(", ")}
                  category={draft.category}
                  beds={draft.beds}
                  maxGuests={draft.maxGuests}
                  amenities={draft.amenities}
                  averageLocalPrice={draft.pricePerNight}
                  onChange={(pricePerNight) =>
                    setDraft((p) => ({ ...p, pricePerNight }))
                  }
                />
              )}
              {activeSection === "basics" && (
                <BasicsEditor
                  maxGuests={draft.maxGuests}
                  bedrooms={draft.bedrooms}
                  beds={draft.beds}
                  bathrooms={draft.bathrooms}
                  checkInTime={draft.checkInTime ?? "14:00"}
                  checkOutTime={draft.checkOutTime ?? "11:00"}
                  onChange={(val) => setDraft((p) => ({ ...p, ...val }))}
                />
              )}
              {activeSection === "amenities" && (
                <AmenitiesEditor
                  value={draft.amenities}
                  onChange={(amenities) =>
                    setDraft((p) => ({ ...p, amenities }))
                  }
                />
              )}
              {activeSection === "location" && (
                <LocationEditor
                  value={{
                    latitude: draft.latitude,
                    longitude: draft.longitude,
                    flatno: draft.flatno,
                    street: draft.street,
                    landmark: draft.landmark,
                    village: draft.village,
                    district: draft.district,
                    state: draft.state,
                    pincode: draft.pincode,
                  }}
                  onChange={(loc) => setDraft((p) => ({ ...p, ...loc }))}
                />
              )}
              {activeSection === "settings" && (
                <ListingSettingsEditor
                  isVerified={draft.isVerified}
                  guideAvailable={draft.guideAvailable}
                  guideFee={draft.guideFee}
                  cancellationPolicy={draft.cancellationPolicy}
                  onChange={(val) => setDraft((p) => ({ ...p, ...val }))}
                  onRequestDelete={() => setDeleteOpen(true)}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EditorShell;
