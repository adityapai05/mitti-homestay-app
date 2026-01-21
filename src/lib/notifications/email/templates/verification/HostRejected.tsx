import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

export function HostRejectedEmail({
  name,
  reason,
}: {
  name: string;
  reason: string;
}) {
  return (
    <BaseEmailLayout title="Host verification update">
      <p>Hello {name},</p>

      <p>Unfortunately, your host verification was not approved.</p>

      <p>
        <strong>Reason:</strong> {reason}
      </p>

      <p>You may update your details and reapply.</p>

      <p>MITTI Team</p>
    </BaseEmailLayout>
  );
}
