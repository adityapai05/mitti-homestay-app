"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

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

interface Props {
  email: string | null;
  emailVerified: boolean;
}

export default function EmailSection({ email, emailVerified }: Props) {
  const [loading, setLoading] = useState(false);

  if (!email) return null;

  async function handleResendVerification() {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">Email</h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-mitti-dark-brown/60">
            Email address
          </span>
          <span className="text-sm text-mitti-dark-brown">{email}</span>

          {!emailVerified && (
            <span className="text-xs text-red-600">Email not verified</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {!emailVerified && (
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="text-sm text-mitti-brown hover:underline cursor-pointer disabled:opacity-60"
            >
              Resend verification email
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-sm text-mitti-brown hover:underline cursor-pointer">
                Reset password
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-mitti-cream border border-mitti-khaki">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-mitti-dark-brown">
                  Reset password?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-mitti-dark-brown/70">
                  We will send a password reset link to your email address.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer hover:bg-mitti-beige">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handlePasswordReset}
                  className="cursor-pointer bg-mitti-brown hover:bg-mitti-dark-brown text-white"
                >
                  Send reset email
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
