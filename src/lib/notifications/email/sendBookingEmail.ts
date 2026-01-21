import { resend, EMAIL_FROM } from "./client";
import { resolveEmail } from "./utils";
import { prisma } from "@/lib/prisma";

import { BookingRequestedEmail } from "./templates/booking/BookingRequested";
import { BookingApprovedEmail } from "./templates/booking/BookingApproved";
import { PaymentConfirmedEmail } from "./templates/booking/PaymentConfirmed";
import { BookingCancelledEmail } from "./templates/booking/BookingCancelled";

import { BookingEmailType } from "./types";

export async function sendBookingEmail(
  bookingId: string,
  type: BookingEmailType
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      homestay: { include: { owner: true } },
    },
  });

  if (!booking) return;

  const guest = booking.user;
  const host = booking.homestay.owner;

  const guestTo = resolveEmail(guest.email);
  const hostTo = resolveEmail(host.email);

  if (type === "BOOKING_REQUESTED") {
    if (guestTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: guestTo,
        subject: "MITTI: Booking request placed",
        react: BookingRequestedEmail({
          recipientName: guest.name,
          homestayName: booking.homestay.name,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
        }),
      });
    }

    if (hostTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: hostTo,
        subject: "MITTI: New booking request",
        react: BookingRequestedEmail({
          recipientName: host.name,
          homestayName: booking.homestay.name,
          checkIn: booking.checkIn.toDateString(),
          checkOut: booking.checkOut.toDateString(),
        }),
      });
    }
  }

  if (type === "BOOKING_APPROVED" && guestTo) {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guestTo,
      subject: "MITTI: Booking approved",
      react: BookingApprovedEmail({
        recipientName: guest.name,
        homestayName: booking.homestay.name,
      }),
    });
  }

  if (type === "BOOKING_CONFIRMED") {
    if (guestTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: guestTo,
        subject: "MITTI: Booking confirmed",
        react: PaymentConfirmedEmail({
          recipientName: guest.name,
          homestayName: booking.homestay.name,
        }),
      });
    }

    if (hostTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: hostTo,
        subject: "MITTI: Booking confirmed",
        react: PaymentConfirmedEmail({
          recipientName: host.name,
          homestayName: booking.homestay.name,
        }),
      });
    }
  }

  if (type === "BOOKING_CANCELLED") {
    if (guestTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: guestTo,
        subject: "MITTI: Booking cancelled",
        react: BookingCancelledEmail({
          recipientName: guest.name,
          homestayName: booking.homestay.name,
        }),
      });
    }

    if (hostTo) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: hostTo,
        subject: "MITTI: Booking cancelled",
        react: BookingCancelledEmail({
          recipientName: host.name,
          homestayName: booking.homestay.name,
        }),
      });
    }
  }
}
