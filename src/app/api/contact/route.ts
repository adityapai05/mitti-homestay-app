import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email/sendContactEmail";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
