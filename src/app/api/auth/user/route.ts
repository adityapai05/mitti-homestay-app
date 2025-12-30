export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";
import { validateFile, uploadImage } from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized or user not found", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        {
          error: "Unauthorized - Missing Session Cookie",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    await prisma.review.deleteMany({
      where: {
        homestay: {
          ownerId: uid,
        },
      },
    });

    await prisma.booking.deleteMany({
      where: {
        homestay: {
          ownerId: uid,
        },
      },
    });

    await prisma.homestay.deleteMany({
      where: {
        ownerId: uid,
      },
    });

    await prisma.user.delete({
      where: { firebaseUid: uid },
    });

    await adminAuth.deleteUser(uid);

    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[DELETE /api/auth/user]", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
        code: "DELETE_FAILED",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        {
          error: "Unauthorized - Missing Session Cookie",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;

    const parsed = userUpdateSchema.safeParse({ name, phoneNumber });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }

    if (!name && !phoneNumber && !imageFile) {
      return NextResponse.json(
        { error: "No fields to update", code: "NO_FIELDS_PROVIDED" },
        { status: 400 }
      );
    }

    let profileImageUrl: string | undefined;
    if (imageFile) {
      validateFile(imageFile);
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      profileImageUrl = await uploadImage(buffer, { folder: "mitti-profiles" });
    }

    await adminAuth.updateUser(uid, {
      displayName: name || undefined,
      phoneNumber: phoneNumber || undefined,
      photoURL: profileImageUrl || undefined,
    });

    const updatedUser = await prisma.user.update({
      where: { firebaseUid: uid },
      data: {
        name: name || undefined,
        phone: phoneNumber || undefined,
        image: profileImageUrl || undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PATCH /api/auth/user]", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
        code: "UPDATE_FAILED",
      },
      { status: 500 }
    );
  }
}
