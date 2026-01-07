"use client";

import Link from "next/link";
import { Eye, Save, ShieldCheck, Clock, Menu } from "lucide-react";

type EditorHeaderProps = {
  homestayId: string;
  title: string;
  isVerified: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
  onSaveAndExit: () => void;
  onToggleSidebar: () => void;
};

const EditorHeader = ({
  homestayId,
  title,
  isVerified,
  isSaving,
  isDirty,
  lastSavedAt,
  onSaveAndExit,
  onToggleSidebar,
}: EditorHeaderProps) => {
  const showSaved = !isSaving && !isDirty && lastSavedAt;

  return (
    <div className="sticky z-30 border-b border-mitti-khaki bg-mitti-cream">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden rounded-md p-2 hover:bg-mitti-beige"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <p className="truncate font-semibold text-mitti-dark-brown">
              {title || "Untitled homestay"}
            </p>

            <div className="flex items-center gap-2 text-xs">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-mitti-olive">
                  <ShieldCheck size={14} />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-mitti-dark-brown/60">
                  <Clock size={14} />
                  Draft
                </span>
              )}

              {showSaved && (
                <span className="text-mitti-dark-brown/50">
                  • Saved just now
                </span>
              )}

              {isSaving && (
                <span className="text-mitti-dark-brown/50">• Saving…</span>
              )}

              {isDirty && !isSaving && (
                <span className="text-mitti-dark-brown/50">
                  • Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href={`/homestays/${homestayId}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-mitti-beige"
          >
            <Eye size={16} />
            View
          </Link>

          <button
            onClick={onSaveAndExit}
            disabled={isSaving || !isDirty}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition
              ${
                isSaving || !isDirty
                  ? "bg-mitti-khaki text-mitti-dark-brown/60 cursor-not-allowed"
                  : "bg-mitti-brown text-white hover:bg-mitti-brown/90"
              }`}
          >
            <Save size={16} />
            Save & exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
