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

const EditorShell = ({ homestay }: { homestay: HomestayEditorData }) => {
  const router = useRouter();
  const initialRef = useRef(homestay);

  const [activeSection, setActiveSection] = useState<EditorSection>("photos");
  const [draft, setDraft] = useState(homestay);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initialRef.current),
    [draft]
  );

  const handleSave = useCallback(async () => {
    if (!isDirty || isSaving) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/host/homestays/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      initialRef.current = draft;
      setLastSavedAt(new Date());
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [draft, isDirty, isSaving]);

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
          setDeleting(true);
          await fetch(`/api/host/homestays/${draft.id}`, { method: "DELETE" });
          router.push("/host/homestays");
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
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-10">
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
