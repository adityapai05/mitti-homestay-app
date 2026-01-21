import * as React from "react";
import { BaseEmailLayout } from "@/lib/notifications/email/BaseEmailLayout";

type Props = {
  hostName: string;
};

export function HostPendingEmail({ hostName }: Props) {
  return (
    <BaseEmailLayout title="New host pending verification">
      <p>Hello Admin,</p>

      <p>
        A new host account <strong>{hostName}</strong> is pending verification.
      </p>

      <p>Please review the host profile in the admin dashboard.</p>
    </BaseEmailLayout>
  );
}
