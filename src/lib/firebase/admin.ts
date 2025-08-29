import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();

export { adminAuth };
