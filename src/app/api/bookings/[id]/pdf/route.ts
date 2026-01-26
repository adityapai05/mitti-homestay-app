import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { BookingPdf } from "@/lib/documents/pdf/templates/booking/BookingPdf";
import { generatePdf } from "@/lib/documents/pdf/generatePdf";
import { CancellationPolicy, Prisma } from "@prisma/client";

export const runtime = "nodejs";

function getPolicyCopy(policy: CancellationPolicy) {
  switch (policy) {
    case "FLEXIBLE":
      return {
        title: "Flexible cancellation",
        description:
          "Cancel 7 days or more before check-in for a full refund. No refund for cancellations made less than 7 days before check-in.",
      };
    case "MODERATE":
      return {
        title: "Moderate cancellation",
        description:
          "Cancel 14 days or more before check-in for a full refund. Cancel 7 to 13 days before check-in for a 50% refund. No refund for cancellations made less than 7 days before check-in.",
      };
    case "STRICT":
      return {
        title: "Strict cancellation",
        description:
          "Cancel 30 days or more before check-in for a 50% refund. No refund for cancellations made less than 30 days before check-in.",
      };
  }
}

function getGstRate(pricePerNight: number) {
  return pricePerNight >= 7500 ? 18 : 12;
} 

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Authentication required", { status: 401 });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      OR: [{ userId: user.id }, { homestay: { ownerId: user.id } }],
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      homestay: {
        select: {
          name: true,
          imageUrl: true,
          village: true,
          district: true,
          state: true,
          category: true,
          pricePerNight: true,
          cancellationPolicy: true,
          checkInTime: true,
          checkOutTime: true,
          owner: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: {
        select: {
          amount: true,
          currency: true,
          status: true,
          razorpayOrderId: true,
          razorpayPaymentId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!booking) {
    return new NextResponse("Not found", { status: 404 });
  }

  const nights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const pricePerNight = Number(booking.homestay.pricePerNight);
  const subtotal = pricePerNight * nights;
  const gstRate = getGstRate(pricePerNight);
  const gstAmount = subtotal * (gstRate / 100);
  const total = subtotal + gstAmount;

  const { renderToStaticMarkup } = await import("react-dom/server");

  const html = renderToStaticMarkup(
    React.createElement(BookingPdf, {
      data: {
        bookingId: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,

        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        guests: booking.guests,

        pricing: {
          pricePerNight: booking.homestay.pricePerNight,
          nights,
          subtotal: new Prisma.Decimal(subtotal),
          gstRate,
          gstAmount: new Prisma.Decimal(gstAmount),
          total: new Prisma.Decimal(total),
        },

        refundAmount: booking.refundAmount,
        refundStatus: booking.refundStatus,

        homestay: {
          name: booking.homestay.name,
          images: booking.homestay.imageUrl,
          address: [
            booking.homestay.village,
            booking.homestay.district,
            booking.homestay.state,
          ]
            .filter(Boolean)
            .join(", "),
          category: booking.homestay.category,
          cancellationPolicy: booking.homestay.cancellationPolicy,
          cancellationPolicyText: getPolicyCopy(
            booking.homestay.cancellationPolicy,
          ),
          checkInTime: booking.homestay.checkInTime,
          checkOutTime: booking.homestay.checkOutTime,
        },

        guest: {
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone,
        },

        host: {
          name: booking.homestay.owner.name,
          email: booking.homestay.owner.email,
          phone: booking.homestay.owner.phone,
        },

        payment: booking.payment
          ? {
              amount: booking.payment.amount,
              currency: booking.payment.currency,
              paymentId: booking.payment.razorpayPaymentId,
              paidAt: booking.payment.createdAt,
            }
          : null,
      },
    }),
  );

  const pdfBuffer = await generatePdf(html);
  const fileName = `MITTI-Booking-${booking.checkIn
    .toISOString()
    .slice(0, 10)}.pdf`;

  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
