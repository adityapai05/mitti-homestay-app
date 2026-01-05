"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { X } from "lucide-react";
import type { AdminAuditLog } from "../_types/admin-audit-log";

export default function AuditLogMetaModal({
  log,
  onClose,
}: {
  log: AdminAuditLog;
  onClose: () => void;
}) {
  const hasMeta =
    log.meta &&
    typeof log.meta === "object" &&
    Object.keys(log.meta as Record<string, unknown>).length > 0;

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl bg-mitti-cream border-mitti-khaki">
        <AlertDialogHeader className="flex flex-row justify-between items-center">
          <AlertDialogTitle className="text-lg text-mitti-dark-brown">
            Audit log details
          </AlertDialogTitle>

          <button onClick={onClose} className="cursor-pointer text-mitti-dark-brown/70 hover:text-mitti-dark-brown">
            <X size={18} />
          </button>
        </AlertDialogHeader>

        {hasMeta ? (
          <pre className="mt-4 rounded-lg bg-white p-4 text-xs overflow-auto border border-mitti-khaki">
            {JSON.stringify(log.meta, null, 2)}
          </pre>
        ) : (
          <div className="mt-4 rounded-lg border border-mitti-khaki bg-white p-4 text-sm text-mitti-dark-brown/60">
            No additional metadata was recorded for this action.
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
