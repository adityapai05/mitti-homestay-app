"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type AuthError,
} from "firebase/auth";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase/client";
import { useAuthModal } from "@/hooks/useAuthModal";

type AuthFormProps = {
  setModalBusy: (isBusy: boolean) => void;
};

type AuthStep = "identity" | "password" | "signup" | "google-only";

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Za-z]/, "Password must include at least one letter")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type IdentityValues = z.infer<typeof emailSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FirebaseErrorWithCustomData extends Error {
  code?: string;
  customData?: {
    message?: string;
  };
}

function getPasswordStrengthLabel(
  password: string,
): "Weak" | "Okay" | "Strong" {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Za-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (score >= 4) return "Strong";
  if (score >= 2) return "Okay";
  return "Weak";
}

function getFriendlyErrorMessage(error: unknown): string {
  const authError = error as Partial<AuthError>;
  switch (authError.code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect password. Please try again.";
    case "auth/user-not-found":
      return "No account found for this email.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before completion.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a bit and try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

async function establishServerSession(): Promise<void> {
  const currentUser = getAuth().currentUser;
  if (!currentUser) {
    throw new Error("User is not authenticated.");
  }
  const idToken = await currentUser.getIdToken(true);
  const sessionRes = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!sessionRes.ok) {
    throw new Error("Failed to create server session.");
  }
  const syncRes = await fetch("/api/auth/sync", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  await fetch("/api/auth/user", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!syncRes.ok) {
    throw new Error("Failed to sync account.");
  }
}

async function resolveRoleAndRedirect(router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/auth/user", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return;
  }

  const user = await res.json();

  switch (user.role) {
    case "ADMIN":
      router.replace("/admin");
      return;

    case "HOST":
      router.replace("/host");
      return;

    default:
      return;
  }
}

/**
 * Check if account has password authentication enabled
 * Returns true if password auth is available, false if Google-only
 */
async function checkIfPasswordEnabled(email: string): Promise<boolean> {
  try {
    // Try to sign in with an impossible password
    // If USER_NOT_FOUND → no password set (Google-only)
    // If INVALID_CREDENTIAL → password exists (just wrong)
    await signInWithEmailAndPassword(
      auth,
      email,
      `__impossible_password_check_${Date.now()}__`,
    );
    return true; // Should never reach here
  } catch (error: unknown) {
    const authError = error as FirebaseErrorWithCustomData;

    // Parse the raw error message from Firebase
    const errorMessage = authError?.message || "";
    const errorJson = authError?.customData?.message || "";

    // Check if it's a USER_NOT_FOUND error (no password provider)
    if (
      errorMessage.includes("USER_NOT_FOUND") ||
      errorJson.includes("USER_NOT_FOUND") ||
      errorMessage.includes("auth/user-not-found")
    ) {
      return false; // Google-only account (no password)
    }

    // INVALID_CREDENTIAL or INVALID_LOGIN_CREDENTIALS means password exists
    return true;
  }
}

export default function AuthForm({ setModalBusy }: AuthFormProps) {
  const router = useRouter();
  const { closeModal } = useAuthModal();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const [step, setStep] = useState<AuthStep>("identity");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const identityForm = useForm<IdentityValues>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
    defaultValues: { password: "" },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: { fullName: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    setModalBusy(isSubmitting);
  }, [isSubmitting, setModalBusy]);

  useEffect(() => {
    passwordForm.clearErrors();
    signupForm.clearErrors();
  }, [step, passwordForm, signupForm]);

  const identityEmail = identityForm.watch("email") ?? "";
  const emailTouched = !!identityForm.formState.touchedFields.email;
  const hasEmailInput = identityEmail.length > 0;
  const isEmailValid = emailRegex.test(identityEmail);

  const signupPassword = signupForm.watch("password") ?? "";
  const passwordStrength = useMemo(
    () => getPasswordStrengthLabel(signupPassword),
    [signupPassword],
  );

  const goToIdentity = useCallback(() => {
    setStep("identity");
    passwordForm.reset({ password: "" });
    signupForm.reset({ fullName: "", password: "", confirmPassword: "" });
  }, [passwordForm, signupForm]);

  /**
   * TWO-PHASE ACCOUNT DETECTION:
   * Phase 1: Check if account exists (createUser probe)
   * Phase 2: If exists, check if password is enabled (signIn probe)
   */
  const onIdentityContinue = identityForm.handleSubmit(async ({ email }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      setEmail(normalizedEmail);

      if (!authReady) {
        toast.message("Preparing secure sign-in...");
        setIsSubmitting(false);
        return;
      }

      // PHASE 1: Check if account exists
      const tempPassword = `__temp_${Date.now()}_${Math.random().toString(36)}__`;

      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          tempPassword,
        );

        // Account created! New user → delete temp account → go to signup
        await credential.user.delete();
        setStep("signup");
        setIsSubmitting(false);
        return;
      } catch (probeError: unknown) {
        const authError = probeError as FirebaseErrorWithCustomData;
        const errorMessage = authError?.message || "";

        // Suppress EMAIL_EXISTS console errors - this is expected behavior
        if (
          errorMessage.includes("EMAIL_EXISTS") ||
          authError.code === "auth/email-already-in-use"
        ) {
          // PHASE 2: Account exists - now check if password is enabled
          const hasPassword = await checkIfPasswordEnabled(normalizedEmail);

          if (hasPassword) {
            // Has password → go to password login
            setStep("password");
          } else {
            // Google-only account → show Google prompt
            setStep("google-only");
          }
          setIsSubmitting(false);
          return;
        }

        // Rate limiting
        if (authError.code === "auth/too-many-requests") {
          toast.error("Too many attempts. Please wait and try again.");
          setIsSubmitting(false);
          return;
        }

        // Other errors
        toast.error(getFriendlyErrorMessage(probeError));
        setIsSubmitting(false);
        return;
      }
    } catch (error: unknown) {
      console.error("Identity check error:", error);
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async ({ password }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await establishServerSession();
      await resolveRoleAndRedirect(router);
      closeModal();
      toast.success("Signed in successfully");
    } catch (error: unknown) {
      const authError = error as AuthError;

      if (
        authError.code === "auth/wrong-password" ||
        authError.code === "auth/invalid-credential"
      ) {
        passwordForm.setError("password", {
          type: "manual",
          message: "Incorrect password. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const onSignupSubmit = signupForm.handleSubmit(
    async ({ fullName, password }) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(credential.user, { displayName: fullName.trim() });
        await sendEmailVerification(credential.user);
        await establishServerSession();
        await resolveRoleAndRedirect(router);
        closeModal();
        toast.success("Verification email sent to your inbox");
      } catch (error: unknown) {
        const authError = error as AuthError;

        if (authError.code === "auth/email-already-in-use") {
          setStep("password");
          toast.message("Account exists. Please sign in.");
          setIsSubmitting(false);
          return;
        }

        toast.error(getFriendlyErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
  );

  const onGoogleSignIn = async (): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (getAuth().currentUser) {
        setIsSubmitting(false);
        return;
      }

      await signInWithPopup(auth, googleProvider);
      await establishServerSession();
      await resolveRoleAndRedirect(router);
      closeModal();
      toast.success("Signed in successfully");
    } catch (error: unknown) {
      const authError = error as AuthError;

      if (authError.code === "auth/popup-closed-by-user") {
        setIsSubmitting(false);
        return;
      }

      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`space-y-6 text-mitti-dark-brown transition-all duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold transition-all duration-300">
          {step === "identity"
            ? "Welcome to MITTI"
            : step === "password"
              ? "Welcome back"
              : step === "google-only"
                ? "Sign in with Google"
                : "Create your account"}
        </h2>
        <p className="text-sm text-mitti-dark-brown/80 transition-all duration-300">
          {step === "identity"
            ? "Continue to explore and book authentic rural stays."
            : step === "signup"
              ? "Your email will be used to send booking confirmations."
              : step === "google-only"
                ? "This account uses Google authentication."
                : email}
        </p>
      </div>

      {step === "identity" && (
        <form
          onSubmit={onIdentityContinue}
          className={`space-y-5 transition-all duration-300 transform ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
                {...identityForm.register("email")}
                className={`h-12 w-full rounded-md border bg-[#fff9ec] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:scale-[1.01] transition-all duration-200 ${
                  hasEmailInput
                    ? isEmailValid
                      ? "border-green-500"
                      : "border-red-300"
                    : "border-mitti-dark-brown"
                }`}
                placeholder="Enter your email"
              />
              {hasEmailInput && isEmailValid && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-green-600 animate-in fade-in duration-200" />
              )}
            </div>
            {emailTouched && identityForm.formState.errors.email && (
              <p className="text-sm text-mitti-error animate-in fade-in slide-in-from-top-1 duration-200">
                {identityForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-md bg-mitti-brown font-medium text-mitti-beige transition-all duration-200 hover:bg-mitti-dark-brown hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer active:scale-[0.98]"
          >
            {isSubmitting ? "Checking..." : "Continue"}
          </button>
        </form>
      )}

      {step === "google-only" && (
        <div
          className={`space-y-5 transition-all duration-300 transform ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-blue-900 mb-2">
              <strong>{email}</strong> is registered with Google sign-in.
            </p>
            <p className="text-xs text-blue-700">
              This account doesn&apos;t have a password. Please use Google to
              continue.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isSubmitting}
            className="h-12 w-full rounded-md bg-mitti-brown font-medium text-mitti-beige transition-all duration-200 hover:bg-mitti-dark-brown hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer active:scale-[0.98]"
          >
            <span className="inline-flex items-center gap-2">
              <FcGoogle className="text-lg" />
              {isSubmitting ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <button
            type="button"
            onClick={goToIdentity}
            className="w-full text-sm text-mitti-dark-brown/70 hover:text-mitti-dark-brown hover:underline cursor-pointer transition-colors duration-200"
          >
            ← Use a different email
          </button>
        </div>
      )}

      {step === "password" && (
        <form
          onSubmit={onPasswordSubmit}
          className={`space-y-5 transition-all duration-300 transform ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isSubmitting}
                {...passwordForm.register("password")}
                className="h-12 w-full rounded-md border border-mitti-dark-brown bg-[#fff9ec] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:scale-[1.01] transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mitti-dark-brown cursor-pointer hover:text-mitti-brown transition-colors duration-200 active:scale-95"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.password && (
              <p className="text-sm text-mitti-error animate-in fade-in slide-in-from-top-1 duration-200">
                {passwordForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-md bg-mitti-brown font-medium text-mitti-beige transition-all duration-200 hover:bg-mitti-dark-brown hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>

            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={goToIdentity}
                className="text-sm text-mitti-dark-brown/70 hover:text-mitti-dark-brown hover:underline cursor-pointer transition-colors duration-200"
              >
                Change email
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await sendPasswordResetEmail(auth, email);
                    toast.success("Password reset email sent");
                  } catch {
                    toast.error("Unable to send reset email");
                  }
                }}
                className="text-sm text-mitti-brown hover:text-mitti-dark-brown hover:underline cursor-pointer transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>
      )}

      {step === "signup" && (
        <form
          onSubmit={onSignupSubmit}
          className={`space-y-5 transition-all duration-300 transform ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="signup-fullname"
              className="block text-sm font-medium"
            >
              Full name
            </label>
            <input
              id="signup-fullname"
              type="text"
              autoComplete="name"
              disabled={isSubmitting}
              {...signupForm.register("fullName")}
              className="h-12 w-full rounded-md border border-mitti-dark-brown bg-[#fff9ec] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:scale-[1.01] transition-all duration-200"
              placeholder="Your full name"
            />
            {signupForm.formState.errors.fullName && (
              <p className="text-sm text-mitti-error animate-in fade-in slide-in-from-top-1 duration-200">
                {signupForm.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isSubmitting}
                {...signupForm.register("password")}
                className="h-12 w-full rounded-md border border-mitti-dark-brown bg-[#fff9ec] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:scale-[1.01] transition-all duration-200"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mitti-dark-brown cursor-pointer hover:text-mitti-brown transition-colors duration-200 active:scale-95"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-mitti-dark-brown/75">
              Strength:{" "}
              <span
                className={`font-medium transition-colors duration-200 ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Okay"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {passwordStrength}
              </span>
            </p>
            {signupForm.formState.errors.password && (
              <p className="text-sm text-mitti-error animate-in fade-in slide-in-from-top-1 duration-200">
                {signupForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isSubmitting}
              {...signupForm.register("confirmPassword")}
              className="h-12 w-full rounded-md border border-mitti-dark-brown bg-[#fff9ec] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:scale-[1.01] transition-all duration-200"
              placeholder="Confirm your password"
            />
            {signupForm.formState.errors.confirmPassword && (
              <p className="text-sm text-mitti-error animate-in fade-in slide-in-from-top-1 duration-200">
                {signupForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-md bg-mitti-brown font-medium text-mitti-beige transition-all duration-200 hover:bg-mitti-dark-brown hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={goToIdentity}
              className="text-sm font-medium text-mitti-brown hover:text-mitti-dark-brown hover:underline cursor-pointer transition-colors duration-200 active:scale-[0.98]"
              disabled={isSubmitting}
            >
              Change email →
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4 pt-1">
        <div className="relative flex items-center justify-center mb-7">
          <hr className="w-full border-t border-mitti-khaki/40" />
          <span className="absolute bg-mitti-beige px-3 text-xs text-mitti-dark-brown/70">
            or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={isSubmitting}
          className="h-12 w-full rounded-md border border-mitti-dark-brown bg-white px-4 text-sm font-medium text-mitti-dark-brown shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 hover:shadow-md hover:border-mitti-brown transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2">
            <FcGoogle className="text-lg" />
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
}
