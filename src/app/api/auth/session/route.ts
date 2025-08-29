import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    const expiresIn = 60 * 60 * 24 * 7 * 1000;

    const decodedIdToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedIdToken;
    console.log("Logged in user:", email, uid);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/session]:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  (await cookies()).delete("__session");

  return NextResponse.json({ success: true });
}
