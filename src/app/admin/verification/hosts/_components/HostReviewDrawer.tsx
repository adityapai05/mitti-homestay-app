"use client";

import { useState, useTransition } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@/components/ui/prebuilt-components/drawer";
import { approveHost, rejectHost } from "../actions";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Textarea } from "@/components/ui/prebuilt-components/textarea";
import { Home, Wallet, BadgeCheck, X } from "lucide-react";
import { toast } from "sonner";

import type { HostVerificationRowItem } from "./HostVerificationRow";

export default function HostReviewDrawer({
  host,
  onClose,
}: {
  host: HostVerificationRowItem;
  onClose: () => void;
}) {
  type HostProfileExtras = {
    languages?: string[];
    about?: string | null;
  };

  const user = host.user as typeof host.user & HostProfileExtras;

  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

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
        {/* Header */}
        <div className="px-6 py-5 border-b border-mitti-khaki flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-mitti-dark-brown">
              {user.name}
            </p>
            <p className="text-sm text-mitti-dark-brown/70">
              Host verification review
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-mitti-dark-brown/60 hover:text-mitti-dark-brown cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <Section title="Basic information">
            <Key
              label="Email / Phone"
              value={user.email || user.phone || "—"}
            />
            <Key
              label="Joined"
              value={new Date(user.createdAt).toDateString()}
            />
            <Key
              label="Languages"
              value={
                user.languages && user.languages.length > 0
                  ? user.languages.join(", ")
                  : "—"
              }
            />
          </Section>

          <Section title="Profile">
            <p className="text-sm leading-relaxed text-mitti-dark-brown/80">
              {user.about || "No profile description provided by host."}
            </p>
          </Section>

          <Section title="Homestays">
            <div className="flex items-center gap-3">
              <Home size={18} className="text-mitti-olive" />
              <span className="text-sm text-mitti-dark-brown">
                Total listings: <strong>{user.homestays.length}</strong>
              </span>
            </div>
          </Section>

          <Section title="Payout setup">
            <div className="flex items-center gap-3">
              <Wallet size={18} className="text-mitti-olive" />
              <span className="text-sm text-mitti-dark-brown">
                Status:{" "}
                <strong>{user.payoutAccount ? "Configured" : "Not set"}</strong>
              </span>
            </div>
          </Section>

          <Section title="Rejection reason">
            <Textarea
              placeholder="Required if rejecting the host"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white"
            />
          </Section>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t border-mitti-khaki flex gap-3">
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await approveHost(user.id);
                toast.success("Host approved");
                onClose();
              })
            }
            className="flex-1 bg-green-600 hover:bg-green-600/80 text-white cursor-pointer"
          >
            <BadgeCheck size={18} />
            Approve host
          </Button>

          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                if (!reason.trim()) {
                  toast.error("Rejection reason is required");
                  return;
                }

                await rejectHost(user.id, reason);
                toast.success("Host rejected");
                onClose();
              })
            }
            className="flex-1 cursor-pointer bg-red-600 hover:bg-red-600/80"
          >
            Reject
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* ---------- helpers ---------- */

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
