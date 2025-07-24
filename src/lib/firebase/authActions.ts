import {
  ConfirmationResult,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "./client";

export const signupWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
    }
    return userCredential;
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("This email is already registered.");
      case "auth/invalid-email":
        throw new Error("Invalid email address.");
      case "auth/weak-password":
        throw new Error("Password should be at least 6 characters.");
      default:
        throw new Error("Failed to create account. Please try again.");
    }
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email.");
      case "auth/wrong-password":
        throw new Error("Incorrect password.");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Try again later.");
      case "auth/network-request-failed":
        throw new Error("Network error. Check your connection.");
      default:
        throw new Error("Login failed. Please try again.");
    }
  }
};

export const signinWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google Sign In Successful: ", result.user);
  } catch (error) {
    console.error("Google Sign In Error: ", error);
  }
};

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (elementId = "recaptcha-container") => {
  if (typeof window === "undefined") return;

  if (!recaptchaVerifier && document?.getElementById(elementId)) {
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
    });
    recaptchaVerifier.render();
  }
};

export const sendOtp = async (phone: string): Promise<ConfirmationResult> => {
  setupRecaptcha();
  if (!recaptchaVerifier) {
    throw new Error("reCAPTCHA not initialized");
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    throw new Error(
      "Failed to send OTP. Please check the number and try again."
    );
  }
};

export const confirmOtp = async (
  otp: string,
  confirmationResult: ConfirmationResult
) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error: any) {
    console.error("OTP confirmation error:", error);
    throw new Error("Invalid OTP. Please try again.");
  }
};
