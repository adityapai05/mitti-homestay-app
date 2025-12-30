import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await req.json();

    // 1️⃣ Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch booking (SOURCE OF TRUTH)
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
        status: "AWAITING_PAYMENT",
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or already paid" },
        { status: 404 }
      );
    }

    // 3️⃣ Atomic transaction
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId: booking.id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: booking.totalPrice,
          currency: "INR",
          status: "SUCCESS",
        },
      }),

      prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          updatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RAZORPAY_VERIFY]", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
