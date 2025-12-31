export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { uploadImage, validateFile } from "@/lib/cloudinary";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  about: z.string().max(500).optional(),
  languages: z.array(z.string()).optional(),
  contactPhone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number")
    .optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;
    const about = formData.get("about") as string | null;
    const languagesRaw = formData.get("languages") as string | null;
    const contactPhone = formData.get("contactPhone") as string | null;

    const parsed = profileSchema.safeParse({
      name: name ?? undefined,
      about: about ?? undefined,
      languages: languagesRaw ? JSON.parse(languagesRaw) : undefined,
      contactPhone: contactPhone ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid profile data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      validateFile(imageFile);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadImage(buffer, { folder: "mitti-profiles" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        about: parsed.data.about,
        languages: parsed.data.languages,
        contactPhone: parsed.data.contactPhone,
        image: imageUrl,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PATCH /api/profile]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
