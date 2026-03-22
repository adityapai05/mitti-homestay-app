import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/notifications/email/sendContactEmail";
import { contactMessageCreateSchema } from "@/lib/validation/adminSchemas";
import { parseJsonBody } from "@/lib/validation/commonSchemas";

export async function POST(req: Request) {
  try {
    const parsedBody = await parseJsonBody(req, contactMessageCreateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const data = parsedBody.data;

    await prisma.contactMessage.create({
      data,
    });

    try {
      await sendContactEmail(data);
    } catch (err) {
      console.error("Email send failed:", err);
      return NextResponse.json(
        { success: false, error: "Email failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
