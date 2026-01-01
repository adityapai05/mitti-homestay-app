"use client";

import Link from "next/link";
import { Eye, Save, ShieldCheck, Clock } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/prebuilt-components/sidebar";

type EditorHeaderProps = {
  homestayId: string;
  title: string;
  isVerified: boolean;

  // save state
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;

  // actions
  onSaveAndExit: () => void;
};

const EditorHeader = ({
  homestayId,
  title,
  isVerified,
  isSaving,
  isDirty,
  lastSavedAt,
  onSaveAndExit,
}: EditorHeaderProps) => {
  const showSavedText = !isSaving && !isDirty && lastSavedAt !== null;

  return (
    <div className="sticky top-0 z-40 bg-mitti-cream border-b border-mitti-khaki">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-semibold truncate text-mitti-dark-brown">
              {title || "Untitled homestay"}
            </h1>

            <div className="flex items-center gap-2 text-xs">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-mitti-olive">
                  <ShieldCheck size={14} />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} />
                  Draft
                </span>
              )}

              {showSavedText && (
                <span className="text-mitti-dark-brown/60">
                  • Saved just now
                </span>
              )}

              {isSaving && (
                <span className="text-mitti-dark-brown/60">• Saving…</span>
              )}

              {isDirty && !isSaving && (
                <span className="text-mitti-dark-brown/60">
                  • Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* View listing */}
          <Link
            href={`/homestays/${homestayId}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border
                       text-sm hover:bg-mitti-beige cursor-pointer"
          >
            <Eye size={16} />
            View
          </Link>

          {/* Save & exit */}
          <button
            onClick={onSaveAndExit}
            disabled={isSaving || !isDirty}
            className={`
              inline-flex items-center gap-2 px-5 py-2 rounded-lg
              text-sm font-medium transition
              ${
                isSaving || !isDirty
                  ? "bg-mitti-khaki text-mitti-dark-brown/60 cursor-not-allowed"
                  : "bg-mitti-brown text-white hover:bg-mitti-brown/90 cursor-pointer"
              }
            `}
          >
            <Save size={16} />
            {isSaving ? "Saving…" : "Save & exit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
