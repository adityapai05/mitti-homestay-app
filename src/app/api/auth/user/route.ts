import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized or user not found" },
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
        { error: "Unauthorized - Missing Session Cookie" },
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
      { error: (error as Error).message || "Internal Server Error" },
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
        { error: "Unauthorized - Missing Session Cookie" },
        { status: 401 }
      );
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const body = await req.json();
    const { name, phoneNumber, profileImage } = body;

    if (!name && !phoneNumber && !profileImage) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    await adminAuth.updateUser(uid, {
      displayName: name,
      phoneNumber,
      photoURL: profileImage,
    });

    const updatedUser = await prisma.user.update({
      where: { firebaseUid: uid },
      data: {
        name,
        phone: phoneNumber,
        image: profileImage,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PATCH /api/auth/user]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
