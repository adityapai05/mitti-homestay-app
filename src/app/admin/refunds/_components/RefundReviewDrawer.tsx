"use client";

import { useTransition } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@/components/ui/prebuilt-components/drawer";
import { Button } from "@/components/ui/prebuilt-components/button";
import { X, IndianRupee, Home } from "lucide-react";
import { toast } from "sonner";
import { processRefund } from "../actions";
import type { RefundRowItem } from "./RefundRow";

export default function RefundReviewDrawer({
  refund,
  onClose,
}: {
  refund: RefundRowItem;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const daysBeforeCheckIn = Math.ceil(
    (new Date(refund.checkIn).getTime() -
      new Date(refund.cancelledAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Drawer open onOpenChange={onClose} direction="right">
      <DrawerOverlay className="bg-black/20" />

      <DrawerContent
        className="
          fixed right-0 top-0 h-screen w-[420px]
          rounded-none
          border-l border-mitti-khaki
          bg-mitti-cream
          flex flex-col
        "
      >
        <div className="px-6 py-5 border-b border-mitti-khaki flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-mitti-dark-brown">
              Refund review
            </p>
            <p className="text-sm text-mitti-dark-brown/70">
              Booking cancellation refund
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-mitti-dark-brown/60 hover:text-mitti-dark-brown cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <Section title="Guest">
            <Key label="Name" value={refund.guest.name} />
            <Key label="Email" value={refund.guest.email || "—"} />
          </Section>

          <Section title="Homestay">
            <div className="flex items-center gap-2 text-sm text-mitti-dark-brown">
              <Home size={16} className="text-mitti-olive" />
              {refund.homestay.name}
            </div>
            <p className="text-xs text-mitti-dark-brown/70">
              {[refund.homestay.village, refund.homestay.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          </Section>

          <Section title="Cancellation">
            <Key
              label="Cancelled on"
              value={new Date(refund.cancelledAt).toDateString()}
            />
            <Key
              label="Days before check in"
              value={`${daysBeforeCheckIn} days`}
            />
            <Key label="Policy" value={refund.homestay.cancellationPolicy} />
          </Section>

          <Section title="Refund">
            <div className="flex items-center gap-2 text-lg font-semibold text-mitti-dark-brown">
              <IndianRupee size={18} />₹
              {Number(refund.refundAmount).toLocaleString()}
            </div>
          </Section>
        </div>

        <div className="px-6 py-5 border-t border-mitti-khaki">
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await processRefund(refund.bookingId);
                toast.success("Refund marked as processed");
                onClose();
              })
            }
            className="w-full bg-green-600 hover:bg-green-600/80 text-white cursor-pointer"
          >
            Process refund
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-mitti-dark-brown/60">
        {title}
      </p>
      {children}
    </div>
  );
}

function Key({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-mitti-dark-brown/60">{label}</span>
      <span className="font-medium text-mitti-dark-brown">{value}</span>
    </div>
  );
}
