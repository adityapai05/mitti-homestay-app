export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { uploadImage, validateFile } from "@/lib/cloudinary";
import { updateSchema as profileUpdateSchema } from "@/lib/validation/profileSchemas";
import { validationErrorResponse } from "@/lib/validation/commonSchemas";

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
    const allowedKeys = new Set([
      "image",
      "name",
      "about",
      "languages",
      "contactPhone",
    ]);

    for (const key of formData.keys()) {
      if (!allowedKeys.has(key)) {
        return NextResponse.json(
          {
            error: "VALIDATION_ERROR",
            details: { formErrors: [`Unknown field: ${key}`], fieldErrors: {} },
          },
          { status: 400 },
        );
      }
    }

    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;
    const about = formData.get("about") as string | null;
    const languagesRaw = formData.get("languages") as string | null;
    const contactPhone = formData.get("contactPhone") as string | null;

    let languages: string[] | undefined;
    if (languagesRaw) {
      try {
        const parsedLanguages = JSON.parse(languagesRaw);
        languages = Array.isArray(parsedLanguages) ? parsedLanguages : undefined;
      } catch {
        return NextResponse.json(
          {
            error: "INVALID_JSON",
            message: "languages must be valid JSON array.",
          },
          { status: 400 },
        );
      }
    }

    const parsed = profileUpdateSchema.safeParse({
      name: name ?? undefined,
      about: about ?? undefined,
      languages,
      contactPhone: contactPhone ?? undefined,
    });

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
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
