import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type BookingRequestedProps = {
  recipientName: string;
  homestayName: string;
  checkIn: string;
  checkOut: string;
};

export function BookingRequestedEmail({
  recipientName,
  homestayName,
  checkIn,
  checkOut,
}: BookingRequestedProps) {
  return (
    <BaseEmailLayout title="Booking request received">
      <p>Hello {recipientName},</p>

      <p>
        A booking request has been placed for <strong>{homestayName}</strong>.
      </p>

      <p>
        <strong>Check-in:</strong> {checkIn}
        <br />
        <strong>Check-out:</strong> {checkOut}
      </p>

      <p>
        You will be notified once the host reviews and approves this request.
      </p>

      <p>Thank you for choosing MITTI.</p>
    </BaseEmailLayout>
  );
}
