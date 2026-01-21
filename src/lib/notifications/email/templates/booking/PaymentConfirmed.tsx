import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
};

export function PaymentConfirmedEmail({ recipientName, homestayName }: Props) {
  return (
    <BaseEmailLayout title="Booking confirmed">
      <p>Hello {recipientName},</p>

      <p>
        Your booking for <strong>{homestayName}</strong> has been successfully
        confirmed.
      </p>

      <p>We wish you a wonderful stay.</p>

      <p>
        Warm regards,
        <br />
        MITTI
      </p>
    </BaseEmailLayout>
  );
}
