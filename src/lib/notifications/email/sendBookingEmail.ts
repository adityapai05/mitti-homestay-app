import { prisma } from "@/lib/prisma";
import { sendEmail, resolveEmail } from "./utils";

import { BookingRequestedEmail } from "./templates/booking/BookingRequested";
import { BookingApprovedEmail } from "./templates/booking/BookingApproved";
import { PaymentConfirmedEmail } from "./templates/booking/PaymentConfirmed";
import { BookingCancelledEmail } from "./templates/booking/BookingCancelled";

import { BookingEmailType } from "./types";

export async function sendBookingEmail(
  bookingId: string,
  type: BookingEmailType,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      homestay: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!booking) return;

  const guestEmail = resolveEmail(booking.user.email);
  const hostEmail = resolveEmail(booking.homestay.owner.email);

  const location = [
    booking.homestay.village,
    booking.homestay.district,
    booking.homestay.state,
  ]
    .filter(Boolean)
    .join(", ");

  const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/${booking.id}/pdf`;
  const pricing = {
    stayBase: booking.stayBase.toString(),
    guideFee: booking.guideFee.toString(),
    platformFee: booking.platformFee.toString(),
    gst: booking.gst.toString(),
    subtotal: booking.subtotal.toString(),
    total: booking.totalPrice.toString(),
  };

  /* ---------------- BOOKING REQUESTED ---------------- */

  if (type === "BOOKING_REQUESTED") {
    if (guestEmail) {
      await sendEmail({
        to: guestEmail,
        subject: "MITTI: Booking request placed",
        react: BookingRequestedEmail({
          recipientName: booking.user.name,
          homestayName: booking.homestay.name,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
        }),
      });
    }

    if (hostEmail) {
      await sendEmail({
        to: hostEmail,
        subject: "MITTI: New booking request",
        react: BookingRequestedEmail({
          recipientName: booking.homestay.owner.name,
          homestayName: booking.homestay.name,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
        }),
      });
    }
  }

  /* ---------------- BOOKING APPROVED ---------------- */

  if (type === "BOOKING_APPROVED" && guestEmail) {
    await sendEmail({
      to: guestEmail,
      subject: "MITTI: Booking approved",
      react: BookingApprovedEmail({
        recipientName: booking.user.name,
        homestayName: booking.homestay.name,
        pricing,
        pdfUrl,
      }),
    });
  }

  /* ---------------- BOOKING CONFIRMED ---------------- */

  if (type === "BOOKING_CONFIRMED") {
    if (guestEmail) {
      await sendEmail({
        to: guestEmail,
        subject: "MITTI: Booking confirmed",
        react: PaymentConfirmedEmail({
          recipientName: booking.user.name,
          homestayName: booking.homestay.name,
          location,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
          pricing,
          pdfUrl,
        }),
      });
    }

    if (hostEmail) {
      await sendEmail({
        to: hostEmail,
        subject: "MITTI: Booking confirmed",
        react: PaymentConfirmedEmail({
          recipientName: booking.homestay.owner.name,
          homestayName: booking.homestay.name,
          location,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
          pricing,
          pdfUrl,
        }),
      });
    }
  }

  /* ---------------- BOOKING CANCELLED ---------------- */

  if (type === "BOOKING_CANCELLED") {
    if (guestEmail) {
      await sendEmail({
        to: guestEmail,
        subject: "MITTI: Booking cancelled",
        react: BookingCancelledEmail({
          recipientName: booking.user.name,
          homestayName: booking.homestay.name,
        }),
      });
    }

    if (hostEmail) {
      await sendEmail({
        to: hostEmail,
        subject: "MITTI: Booking cancelled",
        react: BookingCancelledEmail({
          recipientName: booking.homestay.owner.name,
          homestayName: booking.homestay.name,
        }),
      });
    }
  }
}
