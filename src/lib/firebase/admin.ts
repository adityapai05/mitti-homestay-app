import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    readFileSync("firebase-service-account.json", "utf-8")
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();

export { adminAuth };
