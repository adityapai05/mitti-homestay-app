import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: booking.totalPrice.mul(100).toNumber(), // paise
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
    console.error("[RAZORPAY_ORDER]", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
