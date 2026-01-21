import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

export function HostVerifiedEmail({ name }: { name: string }) {
  return (
    <BaseEmailLayout title="Host account verified">
      <p>Hello {name},</p>

      <p>Your host profile has been successfully verified.</p>

      <p>You can now start accepting bookings.</p>

      <p>
        Welcome aboard,
        <br />
        MITTI
      </p>
    </BaseEmailLayout>
  );
}
