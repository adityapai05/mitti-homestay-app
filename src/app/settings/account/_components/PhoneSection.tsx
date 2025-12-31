"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";

interface Props {
  phone: string | null;
}

export default function PhoneSection({ phone }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Phone number
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-mitti-dark-brown/60">Phone number</span>

          <span className="text-sm text-mitti-dark-brown">
            {phone ?? "No phone number added"}
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-sm text-mitti-brown hover:underline cursor-pointer">
              {phone ? "Update phone number" : "Add phone number"}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-mitti-cream border border-mitti-khaki">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mitti-dark-brown">
                Phone verification unavailable
              </AlertDialogTitle>

              <AlertDialogDescription className="text-mitti-dark-brown/70">
                Adding or updating a phone number requires OTP verification.
                This feature is currently limited during testing and will be
                available soon.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                Got it
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-xs text-mitti-dark-brown/60 max-w-md">
          Phone number support will be enabled once verification is available.
        </p>
      </div>
    </section>
  );
}
