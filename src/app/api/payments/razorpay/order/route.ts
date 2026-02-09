import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("[RAZORPAY_CONFIG] Missing env variables");
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
        status: "AWAITING_PAYMENT",
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not eligible for payment" },
        { status: 400 },
      );
    }

    const razorpay = new Razorpay({ key_id, key_secret });
    const amountInPaise = Math.round(booking.totalPrice.toNumber() * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `bk_${booking.id.slice(0, 12)}`,
      notes: {
        bookingId: booking.id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[POST /api/payments/razorpay/order]", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }
}
