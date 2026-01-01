import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";
import { Role, ServerUser } from "@/types";

export async function getCurrentUser(): Promise<ServerUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) return null;

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,

      name: user.name,
      email: user.email,
      phone: user.phone,
      contactPhone: user.contactPhone,

      image: user.image,
      about: user.about,
      languages: user.languages,

      role: user.role as Role,
      isVerified: user.isVerified,
      isActive: user.isActive,

      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("[getCurrentUser]", error);
    return null;
  }
}
