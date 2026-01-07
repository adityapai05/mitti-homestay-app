import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditorShell from "./_components/EditorShell";
import { requireRole } from "@/lib/auth/requireRole";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HostHomestayEditorPage({ params }: PageProps) {
  const { id } = await params;

  const host = await requireRole("HOST");

  const homestay = await prisma.homestay.findFirst({
    where: {
      id,
      ownerId: host.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
      type: true,
      pricePerNight: true,
      maxGuests: true,
      beds: true,
      bedrooms: true,
      bathrooms: true,
      amenities: true,

      flatno: true,
      street: true,
      landmark: true,
      village: true,
      district: true,
      state: true,
      pincode: true,

      guideAvailable: true,
      guideFee: true,
      latitude: true,
      longitude: true,
      checkInTime: true,
      checkOutTime: true,
      isVerified: true,
      cancellationPolicy: true,
    },
  });

  if (!homestay) {
    notFound();
  }

  return (
    <EditorShell
      homestay={{
        ...homestay,

        pricePerNight: homestay.pricePerNight
          ? Number(homestay.pricePerNight)
          : null,

        flatno: homestay.flatno ?? "",
        street: homestay.street ?? "",
        landmark: homestay.landmark ?? "",
        village: homestay.village ?? "",
        district: homestay.district ?? "",
        state: homestay.state ?? "",
        pincode: homestay.pincode ?? "",

        guideAvailable: homestay.guideAvailable,
        guideFee: homestay.guideFee ? Number(homestay.guideFee) : 500,
        cancellationPolicy: homestay.cancellationPolicy,
      }}
    />
  );
}
