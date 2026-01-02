"use client";

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
import { Button } from "@/components/ui/prebuilt-components/button";
import { useTransition } from "react";
import { processPayout, failPayout } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import { X } from "lucide-react";

function formatIndianDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PayoutReviewModal({
  payout,
  onClose,
}: {
  payout: any;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const host = payout.user;
  const account = host.payoutAccount;
  const lastPayout = host.lastPayout;
  const isHostVerified = host.hostProfile?.verificationStatus === "VERIFIED";

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl bg-mitti-cream border-mitti-khaki">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="
            absolute right-4 top-4
            rounded-md p-1
            text-mitti-dark-brown/60
            bg-mitti-cream
            hover:bg-mitti-cream
            hover:text-mitti-dark-brown
            cursor-pointer
          "
        >
          <X size={24} />
        </Button>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-mitti-dark-brown">
            Payout review
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid grid-cols-2 gap-8 mt-6">
          {/* LEFT: Host info */}
          <div className="space-y-6">
            <section>
              <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60">
                Host
              </p>

              <p className="text-lg font-semibold text-mitti-dark-brown">
                {host.name}
              </p>

              <p className="text-sm text-mitti-dark-brown/70">
                {host.email || host.phone}
              </p>

              <p className="text-xs text-mitti-dark-brown/60 mt-1">
                Host status:{" "}
                <span
                  className={`font-medium ${
                    isHostVerified ? "text-mitti-olive" : "text-amber-600"
                  }`}
                >
                  {isHostVerified ? "Verified" : "Not verified"}
                </span>
              </p>

              {lastPayout && (
                <p className="text-xs text-mitti-dark-brown/60 mt-1">
                  Last payout: ₹{lastPayout.amount} on{" "}
                  {formatIndianDate(lastPayout.processedAt)}
                </p>
              )}

              <Link
                href={`/profile/${host.id}`}
                target="_blank"
                className="inline-block mt-2 text-sm text-mitti-olive hover:underline cursor-pointer"
              >
                View host profile
              </Link>
            </section>

            <section>
              <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60">
                Payout requested on
              </p>
              <p className="text-sm text-mitti-dark-brown">
                {formatIndianDate(payout.createdAt)}
              </p>
            </section>
          </div>

          {/* RIGHT: Financial details */}
          <div className="space-y-6">
            <section className="p-4 rounded-lg bg-mitti-beige border border-mitti-khaki">
              <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60">
                Amount
              </p>
              <p className="text-3xl font-semibold text-mitti-dark-brown">
                ₹ {payout.amount}
              </p>
            </section>

            <section>
              <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60 mb-2">
                Payout method
              </p>

              {account ? (
                <div className="rounded-lg border border-mitti-khaki bg-white p-4 text-sm space-y-2">
                  <p>
                    <strong>Method:</strong> {account.method}
                  </p>
                  <p>
                    <strong>Name:</strong> {account.accountHolderName}
                  </p>

                  {account.method === "UPI" && (
                    <p>
                      <strong>UPI ID:</strong> {account.upiId}
                    </p>
                  )}

                  {account.method === "BANK" && (
                    <>
                      <p>
                        <strong>Bank:</strong> {account.bankName}
                      </p>
                      <p>
                        <strong>Account:</strong> {account.accountNo}
                      </p>
                      <p>
                        <strong>IFSC:</strong> {account.ifsc}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  No payout method configured
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Actions */}
        {payout.status === "PENDING" && (
          <div className="mt-10 flex justify-end gap-4">
            {/* Fail payout */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isPending}
                  className="bg-[#C0392B] hover:bg-[#A93226] text-white cursor-pointer"
                >
                  Mark as failed
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-mitti-dark-brown">
                    Mark payout as failed?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <p className="text-sm text-mitti-dark-brown/70">
                  This will mark the payout as failed and notify the host.
                </p>

                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-[#C0392B] hover:bg-[#A93226]"
                    onClick={() =>
                      startTransition(async () => {
                        await failPayout(payout.id, "Manual rejection");
                        toast.success("Payout marked as failed");
                        onClose();
                      })
                    }
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Process payout */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isPending}
                  className="bg-[#6B8E23] hover:bg-[#5F7F1F] text-white cursor-pointer"
                >
                  Mark as processed
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-mitti-dark-brown">
                    Confirm payout processing
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <p className="text-sm text-mitti-dark-brown/70">
                  This confirms that ₹{payout.amount} has been paid to the host.
                </p>

                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-[#6B8E23] hover:bg-[#5F7F1F]"
                    onClick={() =>
                      startTransition(async () => {
                        await processPayout(payout.id);
                        toast.success("Payout marked as processed");
                        onClose();
                      })
                    }
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
