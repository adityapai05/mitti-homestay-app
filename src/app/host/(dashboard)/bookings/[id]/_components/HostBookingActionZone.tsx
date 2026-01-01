"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";

export default function HostBookingActionZone({
  bookingId,
  status,
  hostActions,
}: {
  bookingId: string;
  status: string;
  hostActions: {
    canApprove: boolean;
    canReject: boolean;
  };
}) {
  async function act(action: "approve" | "reject") {
    const res = await fetch(`/api/host/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      alert("Action failed");
      return;
    }

    window.location.reload();
  }

  // Host actions only make sense while pending approval
  if (
    status !== "PENDING_HOST_APPROVAL" ||
    (!hostActions.canApprove && !hostActions.canReject)
  ) {
    return null;
  }

  return (
    <section className="rounded-xl border border-mitti-khaki bg-mitti-cream p-5 space-y-3">
      <h3 className="text-base font-semibold text-mitti-dark-brown">
        Host actions
      </h3>

      <div className="flex gap-3">
        {hostActions.canApprove && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-lg bg-mitti-olive px-4 py-2 text-sm font-medium text-white hover:opacity-90 cursor-pointer">
                Approve
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  The guest will be notified and asked to complete payment.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => act("approve")}
                  className="bg-mitti-olive text-white hover:opacity-90 cursor-pointer"
                >
                  Approve booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {hostActions.canReject && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-lg bg-mitti-khaki px-4 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-khaki/80 cursor-pointer">
                Reject
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  This booking will be cancelled and the guest will be informed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Keep booking
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => act("reject")}
                  className="bg-red-600 text-white hover:bg-red-600/90 cursor-pointer"
                >
                  Reject booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </section>
  );
}
