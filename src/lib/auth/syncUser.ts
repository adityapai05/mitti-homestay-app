import { prisma } from "@/lib/prisma";
import { UserRecord } from "firebase-admin/auth";

export const syncUserToDatabase = async (firebaseUser: UserRecord) => {
  const isVerified =
    firebaseUser.emailVerified || !!firebaseUser.phoneNumber;

  const user = await prisma.user.upsert({
    where: { firebaseUid: firebaseUser.uid },
    update: {
      email: firebaseUser.email ?? null,
      phone: firebaseUser.phoneNumber ?? null,
      name: firebaseUser.displayName,
      image: firebaseUser.photoURL || null,
      isVerified,
    },
    create: {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email ?? null,
      phone: firebaseUser.phoneNumber ?? null,
      name: firebaseUser.displayName,
      image: firebaseUser.photoURL || null,
      isVerified,
    },
  });

  return user;
};
