"use client";

import { toast } from "sonner";

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

export default function DeactivateAccountSection() {
  async function handleDeactivate() {
    try {
      const res = await fetch("/api/account/deactivate", {
        method: "POST",
      });

      if (!res.ok) throw new Error();

      toast.success("Account deactivated");
      window.location.href = "/";
    } catch {
      toast.error("Failed to deactivate account");
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-red-700">Danger zone</h2>

      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 space-y-3">
        <p className="text-sm text-red-700">Deactivate your account</p>

        <p className="text-xs text-red-700/80 max-w-md">
          Deactivating your account will disable your profile and log you out.
          You can reactivate your account later by contacting support.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-sm text-red-700 hover:underline cursor-pointer">
              Deactivate account
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border border-red-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-700">
                Deactivate account?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-red-700/80">
                Your account will be disabled and you will be logged out. This
                action can be reversed only by contacting MITTI support.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeactivate}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              >
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
