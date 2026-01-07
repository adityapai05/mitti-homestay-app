import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const homestaySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),

  flatno: z.string().optional(),
  street: z.string().optional(),
  landmark: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),

  pricePerNight: z.number().positive(),

  maxGuests: z.number().int().min(1),
  beds: z.number().int().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),

  imageUrl: z.array(z.string().url()).min(5),

  amenities: z.array(z.string()).optional(),

  guideAvailable: z.boolean().optional().default(false),
  guideFee: z.number().positive().optional(),

  cancellationPolicy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]),

  category: z.enum([
    "FARM_STAY",
    "ECO_LODGE",
    "TRADITIONAL_HOME",
    "MOUNTAIN_RETREAT",
    "LAKESIDE",
    "OTHER",
  ]),

  type: z.enum(["ROOM", "HOME"]),

  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("14:00"),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("11:00"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = homestaySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const homestay = await prisma.$transaction(async (tx) => {
      const created = await tx.homestay.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description,

          flatno: parsed.data.flatno,
          street: parsed.data.street,
          landmark: parsed.data.landmark,
          village: parsed.data.village,
          district: parsed.data.district,
          state: parsed.data.state,
          pincode: parsed.data.pincode,

          latitude: parsed.data.latitude,
          longitude: parsed.data.longitude,

          pricePerNight: new Decimal(parsed.data.pricePerNight),
          maxGuests: parsed.data.maxGuests,
          beds: parsed.data.beds,
          bedrooms: parsed.data.bedrooms,
          bathrooms: parsed.data.bathrooms,

          imageUrl: parsed.data.imageUrl,
          amenities: parsed.data.amenities,

          category: parsed.data.category,
          type: parsed.data.type,

          guideAvailable: parsed.data.guideAvailable,
          guideFee: parsed.data.guideFee
            ? new Decimal(parsed.data.guideFee)
            : null,

          checkInTime: parsed.data.checkInTime,
          checkOutTime: parsed.data.checkOutTime,
          cancellationPolicy: parsed.data.cancellationPolicy,

          ownerId: user.id,
        },
      });

      // Promote role if needed
      if (user.role === "USER") {
        await tx.user.update({
          where: { id: user.id },
          data: { role: "HOST" },
        });
      }

      // Ensure HostProfile exists
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
