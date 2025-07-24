"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/firebase/client";
import {
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import {
  loginWithEmail,
  signupWithEmail,
} from "@/lib/firebase/authActions";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import { useAuthModal } from "@/hooks/useAuthModal";

type AuthFormProps = {
  type: "login" | "signup";
};

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [showEmailVerificationPrompt, setShowEmailVerificationPrompt] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const {openModal,closeModal} = useAuthModal();

  type SignupFormData = z.infer<typeof signupSchema>;
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(type === "signup" ? signupSchema : loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      if (type === "signup") {
        console.log("signup data:", data);
        const userCredential = await signupWithEmail(data.email, data.password);

        await updateProfile(userCredential.user, {
          displayName: data.name,
        });

        toast.success("Verification link sent to your email.");
        setUserEmail(data.email);
        setShowEmailVerificationPrompt(true);

        await signOut(auth);
      } else {
        const userCredential = await loginWithEmail(data.email, data.password);

        if (!userCredential.user.emailVerified) {
          await auth.signOut();
          toast.error("Email not verified", {
            action: {
              label: "Resend Link",
              onClick: async () => {
                try {
                  await sendEmailVerification(userCredential.user);
                  toast.success("Verification link resent!");
                } catch (err: any) {
                  toast.error(err.message || "Failed to resend");
                }
              },
            },
          });
          return;
        }
        closeModal();
      }
    } catch (err: any) {
      console.error("Auth error:", err.code, err.message);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showEmailVerificationPrompt ? (
        <EmailVerificationPrompt
          email={userEmail}
          loading={false}
          onBackToLogin={() => {
            setShowEmailVerificationPrompt(false);
            openModal("login");
          }}
        />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 text-mitti-dark-brown"
        >
          {type === "signup" && (
            <div>
              <label className="block text-sm font-medium text-mitti-dark-brown">
                Name
              </label>
              <input
                type="text"
                {...register("name" as const)}
                className="mt-1 w-full rounded-md border border-mitti-dark-brown p-2 text-sm"
                placeholder="Your name"
              />
              {"name" in errors && (
                <p className="text-sm text-mitti-error mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-md border border-mitti-dark-brown p-2 text-sm"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-mitti-error mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mitti-dark-brown">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 w-full rounded-md border border-mitti-dark-brown p-2 text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-mitti-error mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-mitti-brown hover:bg-mitti-dark-brown text-mitti-beige py-2 font-medium hover:bg-opacity-90 transition cursor-pointer"
          >
            {loading
              ? "Processing..."
              : type === "signup"
              ? "Create Account"
              : "Login"}
          </button>
        </form>
      )}
    </>
  );
}
