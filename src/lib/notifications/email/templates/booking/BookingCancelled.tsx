import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
};

export function BookingCancelledEmail({ recipientName, homestayName }: Props) {
  return (
    <BaseEmailLayout title="Booking cancelled">
      <p>Hello {recipientName},</p>

      <p>
        The booking for <strong>{homestayName}</strong> has been cancelled.
      </p>

      <p>
        If a refund is applicable, it will be processed as per the cancellation
        policy.
      </p>

      <p>
        Regards,
        <br />
        MITTI
      </p>
    </BaseEmailLayout>
  );
}
