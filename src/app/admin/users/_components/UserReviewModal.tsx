"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { Button } from "@/components/ui/prebuilt-components/button";
import Link from "next/link";
import { useTransition } from "react";
import { disableUser, enableUser } from "../actions";
import { toast } from "sonner";
import {
  X,
  User,
  Calendar,
  Home,
  BadgeCheck,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

function formatIndianDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UserReviewModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const isHost = user.role === "HOST";
  const isDisabled = !user.isActive;
  const isHostVerified = user.hostProfile?.verificationStatus === "VERIFIED";
  const payoutConfigured = Boolean(user.payoutAccount);

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl bg-mitti-cream border-mitti-khaki">
        {/* Header */}
        <AlertDialogHeader className="relative">
          <AlertDialogTitle className="text-2xl text-mitti-dark-brown">
            User review
          </AlertDialogTitle>

          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1 text-mitti-dark-brown/60 hover:text-mitti-dark-brown cursor-pointer"
          >
            <X size={18} />
          </button>
        </AlertDialogHeader>

        {/* Content */}
        <div className="mt-6 space-y-8">
          {/* Identity */}
          <section>
            <div className="flex items-center gap-2 text-mitti-dark-brown">
              <User size={18} />
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <p className="text-sm text-mitti-dark-brown/70 ml-6">
              {user.email || user.phone}
            </p>

            <div className="mt-3 ml-6 flex gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-mitti-beige border border-mitti-khaki">
                {user.role}
              </span>

              <span
                className={`px-2 py-1 rounded font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>
            </div>
          </section>

          {/* Trust snapshot */}
          <section className="grid grid-cols-2 gap-6 text-sm">
            <InfoRow
              icon={Calendar}
              label="Joined"
              value={formatIndianDate(user.createdAt)}
            />

            <InfoRow
              icon={Home}
              label="Listings"
              value={user.homestays?.length ?? 0}
            />

            {isHost && (
              <InfoRow
                icon={BadgeCheck}
                label="Host verification"
                value={user.hostProfile?.verificationStatus ?? "Not submitted"}
                valueClass={
                  isHostVerified ? "text-mitti-olive" : "text-amber-600"
                }
              />
            )}

            {isHost && (
              <InfoRow
                icon={Wallet}
                label="Payout setup"
                value={payoutConfigured ? "Configured" : "Not configured"}
                valueClass={
                  payoutConfigured ? "text-mitti-olive" : "text-amber-600"
                }
              />
            )}
          </section>

          {/* Activity snapshot */}
          <section className="grid grid-cols-2 gap-6 text-sm">
            <InfoRow
              icon={ArrowDownRight}
              label="Bookings made"
              value={user.bookingsMadeCount ?? 0}
            />

            {isHost && (
              <InfoRow
                icon={ArrowUpRight}
                label="Bookings hosted"
                value={user.bookingsHostedCount ?? 0}
              />
            )}
          </section>

          {/* Admin actions */}
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60">
              Admin actions
            </p>

            <AdminLink
              href={`/profile/${user.id}`}
              label="View public profile"
            />

            {isHost && (
              <>
                <AdminLink
                  href={`/admin/verification/hosts?userId=${user.id}`}
                  label="Review host verification"
                />

                <AdminLink
                  href={`/admin/listings?hostId=${user.id}`}
                  label="View listings by this user"
                />
              </>
            )}
          </section>
        </div>

        {/* Actions */}
        <div className="mt-10 flex justify-end gap-4">
          {isDisabled ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-[#6B8E23] hover:bg-[#5F7F1F] text-white cursor-pointer">
                  Enable account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-mitti-dark-brown">
                    Enable this account?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-[#6B8E23] hover:bg-[#5F7F1F]"
                    onClick={() =>
                      startTransition(async () => {
                        await enableUser(user.id);
                        toast.success("User account enabled");
                        onClose();
                      })
                    }
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-[#C0392B] hover:bg-[#A93226] text-white cursor-pointer">
                  Disable account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-mitti-dark-brown">
                    Disable this account?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <p className="text-sm text-mitti-dark-brown/70">
                  The user will no longer be able to log in or perform actions.
                </p>

                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-[#C0392B] hover:bg-[#A93226]"
                    onClick={() =>
                      startTransition(async () => {
                        await disableUser(user.id);
                        toast.success("User account disabled");
                        onClose();
                      })
                    }
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ---------- Small helpers ---------- */

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: any;
  label: string;
  value: any;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={16} className="mt-0.5 text-mitti-dark-brown/60" />
      <div>
        <p className="text-xs uppercase tracking-wide text-mitti-dark-brown/60">
          {label}
        </p>
        <p className={`font-medium text-mitti-dark-brown ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center justify-between rounded-md border border-mitti-khaki bg-mitti-beige px-3 py-2 text-sm text-mitti-dark-brown hover:bg-mitti-khaki/40 cursor-pointer"
    >
      <span>{label}</span>
      <ChevronRight size={14} />
    </Link>
  );
}
