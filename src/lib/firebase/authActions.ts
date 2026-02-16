import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  AuthError,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./client";
import axios from "axios";

const handleFirebaseError = (
  error: AuthError,
  fallbackMessage: string
): never => {
  const ERROR_MESSAGES: Record<string, string> = {
    // Login-related
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many failed attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-credential": "Invalid email or password.",

    // Signup-related
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",

    // Others
    "auth/popup-closed-by-user": "Popup was closed before completing sign-in.",
  };

  const message = ERROR_MESSAGES[error.code] || fallbackMessage;
  const customError = new Error(message) as Error & { code: string };
  customError.code = error.code;
  throw customError;
};

export const signupWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
    }

    const idToken = await userCredential.user.getIdToken();

    await axios.post("/api/auth/session", { idToken });

    return userCredential;
  } catch (error) {
    handleFirebaseError(
      error as AuthError,
      "Failed to create account. Please try again."
    );
    return undefined as never;
  }
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const idToken = await userCredential.user.getIdToken();

    await axios.post("/api/auth/session", { idToken });

    return userCredential;
  } catch (error) {
    throw handleFirebaseError(
      error as AuthError,
      "Login failed. Please try again."
    );
  }
};

export const signinWithGoogle = async (): Promise<void> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const idToken = await userCredential.user.getIdToken();

    await axios.post("/api/auth/session", { idToken });

    console.log("Google Sign In Successful: ", userCredential.user);
  } catch (error) {
    handleFirebaseError(
      error as AuthError,
      "Google Sign-In failed. Please try again."
    );
  }
};

export const logout = async () => {
  await signOut(auth);
  await axios.delete("/api/auth/session");
};
