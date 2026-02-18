import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";

export interface HostHomestayListItem {
  id: string;
  name: string;
  imageUrl: string[];
  pricePerNight: string;
  isVerified: boolean;
  category: string;
  type: "ROOM" | "HOME";
  village: string | null;
  state: string | null;
  createdAt: Date;
}

export async function getHostHomestays() {
  const host = await requireRole("HOST");

  const homestays = await prisma.homestay.findMany({
    where: {
      ownerId: host.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      pricePerNight: true,
      isVerified: true,
      category: true,
      type: true,
      village: true,
      state: true,
      createdAt: true,
    },
  });

  return homestays.map((stay) => ({
    ...stay,
    pricePerNight: stay.pricePerNight.toString(),
  })) as HostHomestayListItem[];
}
