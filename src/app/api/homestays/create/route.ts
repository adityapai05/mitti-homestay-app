import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import {
  sendAdminHomestayPendingEmail,
  sendAdminHostPendingEmail,
} from "@/lib/notifications/email/sendAdminEmail";
import { createSchema as homestayCreateSchema } from "@/lib/validation/homestaySchemas";
import { parseJsonBody } from "@/lib/validation/commonSchemas";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedBody = await parseJsonBody(req, homestayCreateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const payload = parsedBody.data;

    const homestay = await prisma.$transaction(async (tx) => {
      const created = await tx.homestay.create({
        data: {
          name: payload.name,
          description: payload.description,
          flatno: payload.flatno,
          street: payload.street,
          landmark: payload.landmark,
          village: payload.village,
          district: payload.district,
          state: payload.state,
          pincode: payload.pincode,
          latitude: payload.latitude,
          longitude: payload.longitude,
          pricePerNight: new Decimal(payload.pricePerNight),
          maxGuests: payload.maxGuests,
          beds: payload.beds,
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          imageUrl: payload.imageUrl,
          amenities: payload.amenities,
          category: payload.category,
          type: payload.type,
          guideAvailable: payload.guideAvailable,
          guideFee: payload.guideFee
            ? new Decimal(payload.guideFee)
            : null,
          checkInTime: payload.checkInTime,
          checkOutTime: payload.checkOutTime,
          cancellationPolicy: payload.cancellationPolicy,
          ownerId: user.id,
        },
      });

      if (user.role === "USER") {
        await tx.user.update({
          where: { id: user.id },
          data: { role: "HOST" },
        });
      }

      await tx.hostProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          verificationStatus: "PENDING",
        },
      });

      return created;
    });

    await sendAdminHomestayPendingEmail({
      homestayName: homestay.name,
      hostName: user.name,
    });

    await sendAdminHostPendingEmail({
      hostName: user.name,
    });

    return NextResponse.json(homestay, { status: 201 });
  } catch (error) {
    console.error("[POST /homestays/create]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
