import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  name: string;
  homestayName: string;
  reason: string;
};

export function HomestayRejectedEmail({ name, homestayName, reason }: Props) {
  return (
    <BaseEmailLayout title="Homestay verification rejected">
      <p>Hello {name},</p>

      <p>
        Unfortunately, your homestay <strong>{homestayName}</strong> could not
        be verified at this time.
      </p>

      <p>
        <strong>Reason provided:</strong>
      </p>

      <p>{reason}</p>

      <p>
        You may update the listing details and resubmit it for verification.
      </p>

      <p>– Team MITTI</p>
    </BaseEmailLayout>
  );
}
