import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { syncUserToDatabase } from "@/lib/auth/syncUser";

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // ✅ Fetch full user record
    const firebaseUser = await adminAuth.getUser(decodedToken.uid);

    const user = await syncUserToDatabase(firebaseUser);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Sync user error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
