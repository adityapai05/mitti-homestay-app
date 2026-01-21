import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  name: string;
  homestayName: string;
};

export function HomestayVerifiedEmail({ name, homestayName }: Props) {
  return (
    <BaseEmailLayout title="Homestay verified">
      <p>Hello {name},</p>

      <p>
        Your homestay <strong>{homestayName}</strong> has been successfully
        verified by the MITTI team.
      </p>

      <p>
        Your listing is now visible to guests and can start receiving booking
        requests.
      </p>

      <p>We wish you many great hosting experiences.</p>

      <p>– Team MITTI</p>
    </BaseEmailLayout>
  );
}
