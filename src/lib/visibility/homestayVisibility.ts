import { Prisma } from "@prisma/client";

type VisibilityContext = {
  userId?: string;
  role?: "USER" | "HOST" | "ADMIN";
};

export function publicHomestayWhere(): Prisma.HomestayWhereInput {
  return {
    isVerified: true,
  };
}

export function hostHomestayWhere(
  ctx: VisibilityContext
): Prisma.HomestayWhereInput {
  if (!ctx.userId) {
    throw new Error("Host visibility requires userId");
  }

  return {
    OR: [
      { isVerified: true },
      { ownerId: ctx.userId },
    ],
  };
}

export function adminHomestayWhere(): Prisma.HomestayWhereInput {
  return {};
}
