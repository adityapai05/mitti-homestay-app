import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
};

export function BookingApprovedEmail({ recipientName, homestayName }: Props) {
  return (
    <BaseEmailLayout title="Booking approved">
      <p>Hello {recipientName},</p>

      <p>
        Your booking request for <strong>{homestayName}</strong> has been
        approved by the host.
      </p>

      <p>Please complete the payment to confirm your booking.</p>

      <p>Thank you for choosing MITTI.</p>
    </BaseEmailLayout>
  );
}
