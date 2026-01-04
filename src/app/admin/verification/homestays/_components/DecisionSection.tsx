"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Textarea } from "@/components/ui/prebuilt-components/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { approveHomestay, rejectHomestay } from "../actions";
import { toast } from "sonner";
import type { AdminHomestay } from "./HomestayVerificationTable";

export default function DecisionSection({
  homestay,
  onClose,
}: {
  homestay: AdminHomestay;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Final decision
        </h2>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review carefully. This action affects platform trust and visibility.
        </p>
      </div>

      <Textarea
        placeholder="Rejection reason (required only if rejecting)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="bg-white border-mitti-khaki focus:border-mitti-olive"
      />

      <div className="flex gap-4 pt-2">
        {/* APPROVE */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending}
              className="flex-1 bg-mitti-olive hover:bg-mitti-olive/90 text-white cursor-pointer"
            >
              Approve homestay
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mitti-dark-brown">
                Approve this homestay?
              </AlertDialogTitle>
              <p className="text-sm text-mitti-dark-brown/70">
                This homestay will become visible to users on MITTI.
              </p>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-mitti-olive hover:bg-mitti-olive/90 text-white cursor-pointer"
                onClick={() =>
                  startTransition(async () => {
                    await approveHomestay(homestay.id);
                    toast.success("Homestay approved");
                    onClose();
                  })
                }
              >
                Confirm approval
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* REJECT */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending}
              className="flex-1 bg-[#C94A3F] hover:bg-[#B34238] text-white cursor-pointer"
            >
              Reject homestay
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mitti-dark-brown">
                Reject this homestay?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-[#C94A3F] hover:bg-[#B34238] text-white cursor-pointer"
                onClick={() =>
                  startTransition(async () => {
                    if (!reason.trim()) {
                      toast.error("Rejection reason is required");
                      return;
                    }
                    await rejectHomestay(homestay.id, reason);
                    toast.success("Homestay rejected");
                    onClose();
                  })
                }
              >
                Confirm rejection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
