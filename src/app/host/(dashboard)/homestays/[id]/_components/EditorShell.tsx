"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/prebuilt-components/sidebar";

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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteListingDialog from "@/components/host/DeleteListingDialog";

type EditorSection =
  | "photos"
  | "title"
  | "description"
  | "pricing"
  | "basics"
  | "amenities"
  | "location"
  | "settings";

const DEFAULT_SECTION: EditorSection = "photos";
const AUTOSAVE_DELAY = 1200;

const EditorShell = ({ homestay }: { homestay: HomestayEditorData }) => {
  const router = useRouter();

  const initialRef = useRef<HomestayEditorData>(homestay);

  const [activeSection, setActiveSection] =
    useState<EditorSection>(DEFAULT_SECTION);

  const [draft, setDraft] = useState<HomestayEditorData>(homestay);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(initialRef.current);
  }, [draft]);

  const handleSave = useCallback(async () => {
    if (!isDirty || isSaving) return;

    try {
      setIsSaving(true);

      const res = await fetch(`/api/host/homestays/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save changes");
      }

      initialRef.current = draft;
      setLastSavedAt(new Date());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }, [draft, isDirty, isSaving]);

  useEffect(() => {
    if (!isDirty) return;

    const t = setTimeout(() => {
      handleSave();
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(t);
  }, [handleSave, isDirty, draft]);

  const handleSaveAndExit = async () => {
    await handleSave();
    router.push("/host/homestays");
    toast.success("Changes saved successfully!");
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const res = await fetch(`/api/host/homestays/${draft.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete listing");
      }

      toast.success("Listing deleted");
      router.push("/host/homestays");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <DeleteListingDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={deleting}
        onConfirm={handleDelete}
      />

      <div className="flex w-full bg-mitti-beige">
        <EditorSidebar
          activeSection={activeSection}
          draft={draft}
          onSectionChange={setActiveSection}
        />

        <SidebarInset className="flex flex-col w-full min-h-screen">
          <EditorHeader
            homestayId={draft.id}
            title={draft.name}
            isVerified={draft.isVerified}
            isSaving={isSaving}
            isDirty={isDirty}
            lastSavedAt={lastSavedAt}
            onSaveAndExit={handleSaveAndExit}
          />

          <main className="flex-1 px-4 sm:px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-10">
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
                  onChange={(description) =>
                    setDraft((p) => ({ ...p, description }))
                  }
                />
              )}

              {activeSection === "pricing" && (
                <PricingEditor
                  value={draft.pricePerNight}
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
                    latitude: draft.latitude!,
                    longitude: draft.longitude!,
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
                  onChange={(val) => setDraft((p) => ({ ...p, ...val }))}
                  onRequestDelete={() => setDeleteOpen(true)}
                />
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EditorShell;
