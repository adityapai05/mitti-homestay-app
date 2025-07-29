import { adminAuth } from "../firebase/admin";
import { DecodedIdToken } from "firebase-admin/auth";

export const verifyFirebaseToken = async (
  token: string
): Promise<DecodedIdToken> => {
  if (!token) {
    throw new Error("Missing Firebase ID token");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw new Error("Invalid or expired Firebase ID token");
  }
};
