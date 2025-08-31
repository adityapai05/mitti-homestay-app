export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    return user;
  } catch (error) {
    console.error("[getCurrentUser]", error);
    return null;
  }
}
