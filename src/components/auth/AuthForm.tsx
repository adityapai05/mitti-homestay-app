"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/firebase/client";
import { sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import { loginWithEmail, signupWithEmail } from "@/lib/firebase/authActions";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import { useAuthModal } from "@/hooks/useAuthModal";
import { Eye, EyeOff } from "lucide-react";

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

type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;
type FormData = SignupFormData | LoginFormData;

export default function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerificationPrompt, setShowEmailVerificationPrompt] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { openModal, closeModal } = useAuthModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(type === "signup" ? signupSchema : loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      if (type === "signup") {
        const userCredential = await signupWithEmail(data.email, data.password);
        await updateProfile(userCredential.user, {
          displayName: (data as SignupFormData).name,
        });

        await sendEmailVerification(userCredential.user);

        toast.success(
          "Signup successful! Verification link sent to your email."
        );

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
                } catch (err: unknown) {
                  if (
                    typeof err === "object" &&
                    err !== null &&
                    "message" in err &&
                    typeof err.message === "string"
                  ) {
                    toast.error(err.message);
                  } else {
                    toast.error("Something went wrong. Please try again.");
                  }
                }
              },
            },
          });
          return;
        }

        toast.success("Login successful!");
        closeModal();
      }
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      toast.error(`Auth error: ${error}`);
      console.error("Firebase Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showEmailVerificationPrompt ? (
        <EmailVerificationPrompt
          email={userEmail}
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
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-md border border-mitti-dark-brown bg-[#fff9ec] p-2 pr-10 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mitti-brown"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-mitti-dark-brown cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-mitti-error">
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
